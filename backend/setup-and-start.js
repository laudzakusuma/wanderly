const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Wanderly Backend Setup & Start\n');

// Step 1: Check .env file
console.log('1️⃣ Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ .env file not found! Creating...');
  const envContent = `# MongoDB
MONGO_URI=mongodb://localhost:27017/wanderly

# Server
PORT=5000
NODE_ENV=development

# OpenAI API (optional for now)
OPENAI_API_KEY=sk-your-key-here
`;
  fs.writeFileSync(envPath, envContent);
  console.log('   ✅ .env file created');
} else {
  console.log('   ✅ .env file exists');
}

// Step 2: Check node_modules
console.log('\n2️⃣ Checking dependencies...');
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('   ⏳ Installing dependencies... (this may take a few minutes)');
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.log('   ❌ Installation failed:', error.message);
      return;
    }
    console.log('   ✅ Dependencies installed');
    startServer();
  });
} else {
  console.log('   ✅ Dependencies already installed');
  startServer();
}

function startServer() {
  console.log('\n3️⃣ Starting server...');
  console.log('   Server will start on http://localhost:5000');
  console.log('   Press Ctrl+C to stop\n');
  console.log('─'.repeat(60));
  
  const server = exec('node server.js', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Server error:', error.message);
      return;
    }
  });

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
}