const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function backupDatabase() {
  try {
    console.log('📦 Creating database backup...');
    
    // Tạo thư mục backups nếu chưa có
    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    // Tạo tên file backup với timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = path.join(backupsDir, `backup_${timestamp}.sql`);
    
    // Lấy container name của postgres
    const containerName = execSync("docker ps -qf 'name=postgres'", { encoding: 'utf8' }).trim();
    
    if (!containerName) {
      throw new Error('PostgreSQL container not found');
    }
    
    // Thực hiện backup
    const command = `docker exec ${containerName} pg_dump -U postgres -d alpew-db > "${backupFile}"`;
    execSync(command);
    
    console.log(`✅ Backup created: ${backupFile}`);
    console.log(`📊 Backup size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);
    
    return backupFile;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  backupDatabase();
}

module.exports = { backupDatabase };