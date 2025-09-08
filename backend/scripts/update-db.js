const { backupDatabase } = require('./backup-db');
const { checkDatabase } = require('./check-db');
const { execSync } = require('child_process');

async function updateDatabase() {
  console.log('🚀 Starting database update process...\n');
  
  // Bước 1: Kiểm tra database hiện tại
  console.log('STEP 1: Checking current database...');
  if (!checkDatabase()) {
    console.log('❌ Database check failed. Please ensure PostgreSQL container is running.');
    process.exit(1);
  }
  
  // Bước 2: Backup
  console.log('\nSTEP 2: Creating backup...');
  const backupFile = backupDatabase();
  
  // Bước 3: Update schema
  console.log('\nSTEP 3: Updating schema...');
  try {
    execSync('pnpm prisma generate', { stdio: 'inherit' });
    execSync('pnpm prisma db push', { stdio: 'inherit' });
    console.log('✅ Schema updated successfully');
  } catch (error) {
    console.error('❌ Schema update failed:', error.message);
    process.exit(1);
  }
  
  // Bước 4: Run incremental seed
  console.log('\nSTEP 4: Running incremental seed...');
  try {
    execSync('npx tsx prisma/seed-update.ts', { stdio: 'inherit' });
    console.log('✅ Incremental seed completed');
  } catch (error) {
    console.error('❌ Seed update failed:', error.message);
    console.log(`💡 You can restore from backup: ${backupFile}`);
    process.exit(1);
  }
  
  // Bước 5: Verify
  console.log('\nSTEP 5: Verifying update...');
  checkDatabase();
  
  console.log('\n🎉 Database update completed successfully!');
  console.log(`📂 Backup saved: ${backupFile}`);
  console.log('\n🔗 Quick links:');
  console.log('   • Prisma Studio: pnpm db:studio');
  console.log('   • Admin Panel: http://localhost:3000/admin');
  console.log('   • Demo accounts: admin@demo.com / demo123456');
}

if (require.main === module) {
  updateDatabase();
}

module.exports = { updateDatabase };