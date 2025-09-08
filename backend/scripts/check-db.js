const { execSync } = require('child_process');

function checkDatabase() {
  try {
    console.log('🔍 Checking database status...');
    
    // Kiểm tra container
    const containerName = execSync("docker ps -qf 'name=postgres'", { encoding: 'utf8' }).trim();
    
    if (!containerName) {
      console.log('❌ PostgreSQL container not found or not running');
      return false;
    }
    
    console.log(`✅ Container found: ${containerName}`);
    
    // Kiểm tra kết nối database
    const queries = [
      'SELECT COUNT(*) as user_count FROM "User";',
      'SELECT COUNT(*) as story_count FROM "Story";',
      'SELECT COUNT(*) as genre_count FROM "Genre";',
      'SELECT COUNT(*) as ad_count FROM "Ad";',
      'SELECT COUNT(*) as chapter_count FROM "Chapter";',
    ];
    
    console.log('\n📊 Database Statistics:');
    queries.forEach(query => {
      try {
        const result = execSync(
          `docker exec ${containerName} psql -U postgres -d webtruyen_db -t -c "${query}"`,
          { encoding: 'utf8' }
        ).trim();
        
        const tableName = query.match(/FROM "(\w+)"/)[1];
        console.log(`   ${tableName}: ${result}`);
      } catch (error) {
        console.log(`   ${query}: Error - ${error.message}`);
      }
    });
    
    // Kiểm tra users mới nhất
    console.log('\n👤 Recent Users:');
    try {
      const recentUsers = execSync(
        `docker exec ${containerName} psql -U postgres -d webtruyen_db -c "SELECT username, email, role FROM \\"User\\" ORDER BY \\"createdAt\\" DESC LIMIT 5;"`,
        { encoding: 'utf8' }
      );
      console.log(recentUsers);
    } catch (error) {
      console.log('   Error fetching recent users:', error.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  checkDatabase();
}

module.exports = { checkDatabase };
