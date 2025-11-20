/**
 * Script để chạy migrations lên production database
 * Chạy: node run-migrations-production.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Lấy DATABASE_URL từ environment variable
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('❌ Lỗi: DATABASE_URL không được set!');
  console.log('');
  console.log('Hãy làm 1 trong 2 cách:');
  console.log('1. Tạo file .env trong thư mục backend/ với nội dung:');
  console.log('   DATABASE_URL=your_production_database_url_here');
  console.log('');
  console.log('2. Hoặc chạy với biến môi trường:');
  console.log('   DATABASE_URL=your_url node run-migrations-production.js');
  process.exit(1);
}

console.log('🔍 Kết nối tới database production...');
console.log(`📍 Host: ${new URL(databaseUrl).host}`);
console.log('');

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Đã kết nối database thành công!');
    console.log('');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Sort để chạy theo thứ tự 001, 002, 003...

    console.log(`📋 Tìm thấy ${files.length} migration files:`);
    files.forEach(f => console.log(`   - ${f}`));
    console.log('');

    for (const file of files) {
      console.log(`🔄 Đang chạy: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ Hoàn thành: ${file}`);
      } catch (error) {
        console.error(`❌ Lỗi khi chạy ${file}:`, error.message);
        throw error;
      }
    }

    console.log('');
    console.log('🎉 Đã chạy xong tất cả migrations!');
    console.log('');
    
    // Kiểm tra các bảng đã được tạo
    console.log('🔍 Kiểm tra các bảng đã tạo:');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    console.log('');
    console.log('✨ Database đã sẵn sàng sử dụng!');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();

