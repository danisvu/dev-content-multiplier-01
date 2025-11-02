#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_PORT = 3911;
const BACKEND_HOST = 'localhost';
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const ENV_FILE = path.join(__dirname, 'backend', '.env');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     KIỂM TRA KẾT NỐI SERVER - Content Ideas Manager        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkHealthEndpoint(url, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const elapsed = Date.now() - startTime;
        resolve({
          connected: true,
          statusCode: res.statusCode,
          elapsed,
          data: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', (error) => {
      const elapsed = Date.now() - startTime;
      resolve({
        connected: false,
        error: error.message,
        elapsed,
        code: error.code
      });
    });

    req.setTimeout(timeout, () => {
      req.destroy();
      resolve({
        connected: false,
        error: 'Timeout',
        elapsed: Date.now() - startTime
      });
    });
  });
}

function checkPort(port = 3911) {
  return new Promise((resolve) => {
    const socket = require('net').createConnection({ port, host: 'localhost', timeout: 1000 });
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  // Step 1: Check .env file
  console.log('📋 BƯỚC 1: Kiểm tra cấu hình');
  console.log('─────────────────────────────────────────────────────────────');

  if (fs.existsSync(ENV_FILE)) {
    console.log('✅ File .env tồn tại:', ENV_FILE);
    const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
    const portMatch = envContent.match(/PORT=(\d+)/);
    const portFromEnv = portMatch ? parseInt(portMatch[1]) : 3001;
    console.log(`📍 PORT từ .env: ${portFromEnv}`);

    if (portFromEnv !== BACKEND_PORT) {
      console.log(`⚠️  CẢNH BÁO: PORT trong .env (${portFromEnv}) không khớp với PORT mong đợi (${BACKEND_PORT})`);
    }
  } else {
    console.log('❌ Không tìm thấy file .env');
  }

  console.log(`\n📡 Backend URL: ${BACKEND_URL}`);
  console.log(`🎯 Frontend expects: http://localhost:3911/api`);

  // Step 2: Check if port is in use
  console.log('\n\n📋 BƯỚC 2: Kiểm tra port có đang được sử dụng không');
  console.log('─────────────────────────────────────────────────────────────');

  const portInUse = await checkPort(BACKEND_PORT);
  if (portInUse) {
    console.log(`✅ Port ${BACKEND_PORT} đang được sử dụng (server đang chạy)`);
  } else {
    console.log(`❌ Port ${BACKEND_PORT} không có gì lắng nghe (server CHƯA khởi động)`);
  }

  // Step 3: Check health endpoint
  console.log('\n\n📋 BƯỚC 3: Kiểm tra Health Check Endpoint');
  console.log('─────────────────────────────────────────────────────────────');

  console.log(`🔍 Gửi request đến: ${BACKEND_URL}/health`);
  const healthResult = await checkHealthEndpoint(`${BACKEND_URL}/health`);

  if (healthResult.connected) {
    console.log(`✅ Server phản hồi (${healthResult.statusCode})`);
    console.log(`⏱️  Thời gian phản hồi: ${healthResult.elapsed}ms`);
    if (healthResult.data) {
      console.log(`📊 Server response:`, healthResult.data);
    }
  } else {
    console.log(`❌ Server KHÔNG phản hồi`);
    console.log(`❌ Lỗi: ${healthResult.error}`);
    console.log(`❌ Error Code: ${healthResult.code || 'N/A'}`);
    console.log(`⏱️  Elapsed time: ${healthResult.elapsed}ms`);
  }

  // Step 4: Recommendations
  console.log('\n\n📋 BƯỚC 4: Khuyến nghị');
  console.log('─────────────────────────────────────────────────────────────');

  if (!portInUse && !healthResult.connected) {
    console.log('⚠️  BACKEND KHÔNG CHẠY!');
    console.log('\n🔧 Để khởi động backend:');
    console.log('   1. Mở terminal tại thư mục backend:');
    console.log('      $ cd backend');
    console.log('   2. Cài đặt dependencies (nếu chưa cài):');
    console.log('      $ npm install');
    console.log('   3. Khởi động database (nếu chưa chạy):');
    console.log('      $ docker-compose up -d');
    console.log('   4. Khởi động backend development server:');
    console.log('      $ npm run dev');
    console.log('   5. Kiểm tra backend đã chạy ở: ' + BACKEND_URL);
    console.log('\n');
  } else if (portInUse && healthResult.connected) {
    console.log('✅ Backend đang chạy bình thường!');
    console.log('✅ Bạn có thể sử dụng Generate Ideas mà không có vấn đề.');
    console.log('\nNếu vẫn gặp lỗi, kiểm tra:');
    console.log('   - Database có kết nối được không?');
    console.log('   - GEMINI_API_KEY hoặc DEEPSEEK_API_KEY có đúng không?');
    console.log('   - Xem logs của backend để chi tiết hơn');
  } else {
    console.log('⚠️  Tình trạng không rõ. Kiểm tra logs chi tiết.');
  }

  // Step 5: Try to connect to database
  console.log('\n\n📋 BƯỚC 5: Kiểm tra kết nối Database');
  console.log('─────────────────────────────────────────────────────────────');

  if (fs.existsSync(ENV_FILE)) {
    const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
    const dbMatch = envContent.match(/DATABASE_URL=(.+)/);
    if (dbMatch) {
      const dbUrl = dbMatch[1];
      console.log(`📍 Database URL: ${dbUrl}`);

      // Extract host and port from DATABASE_URL
      const hostMatch = dbUrl.match(/@(.*?):/);
      const portMatch = dbUrl.match(/:(\d+)\//);

      if (hostMatch && portMatch) {
        const dbHost = hostMatch[1];
        const dbPort = parseInt(portMatch[1]);

        const dbConnected = await checkPort(dbPort);
        if (dbConnected) {
          console.log(`✅ Database port ${dbPort} đang lắng nghe`);
        } else {
          console.log(`❌ Database port ${dbPort} KHÔNG lắng nghe`);
          console.log('💡 Để khởi động database: docker-compose up -d');
        }
      }
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                   Kiểm tra hoàn tất                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

main().catch(console.error);
