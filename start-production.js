#!/usr/bin/env node

// Production startup script that ensures proper environment and database setup
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET'
];

console.log('Checking required environment variables...');
const missingVars = [];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    console.log(`✓ ${varName} is set`);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nDeployment failed due to missing environment variables.');
  process.exit(1);
}

// Deploy database schema
console.log('\nDeploying database schema...');
const dbPush = spawn('npm', ['run', 'db:push'], {
  stdio: 'inherit',
  cwd: __dirname
});

dbPush.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Database schema deployment failed with exit code ${code}`);
    process.exit(1);
  }
  
  console.log('✓ Database schema deployed successfully');
  
  // Start the production server
  console.log('\nStarting production server...');
  const server = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    server.kill('SIGINT');
  });
});

dbPush.on('error', (err) => {
  console.error('❌ Failed to start database deployment:', err.message);
  process.exit(1);
});