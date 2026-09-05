#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Building Study Log application...');

// Function to read .env file
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const envContent = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

// Read the HTML template
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Load environment variables from .env file and process.env
const localEnv = loadEnvFile(path.join(__dirname, '../.env'));
const envVars = {
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || localEnv.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || localEnv.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || localEnv.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || localEnv.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || localEnv.VITE_FIREBASE_APP_ID
};

console.log('Environment variables found:');
Object.keys(envVars).forEach(key => {
  console.log(`  ${key}: ${envVars[key] ? '✓ Set' : '✗ Missing'}`);
});

// Only replace if environment variables are provided
if (envVars.VITE_FIREBASE_API_KEY && envVars.VITE_FIREBASE_PROJECT_ID) {
  console.log('✓ Firebase environment variables found, injecting configuration...');
  
  // Create the Firebase config object
  const firebaseConfig = `{
  apiKey: "${envVars.VITE_FIREBASE_API_KEY}",
  authDomain: "${envVars.VITE_FIREBASE_AUTH_DOMAIN}",
  projectId: "${envVars.VITE_FIREBASE_PROJECT_ID}",
  storageBucket: "${envVars.VITE_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${envVars.VITE_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${envVars.VITE_FIREBASE_APP_ID}"
}`;

  // Replace the placeholder config with the real one
  html = html.replace(
    /const firebaseConfig = \{[\s\S]*?\};/,
    `const firebaseConfig = ${firebaseConfig};`
  );
  
  console.log('✓ Firebase configuration injected successfully');
  console.log('✓ App will use your Firebase project for authentication and data storage');
} else {
  console.log('⚠ No Firebase environment variables found, using placeholder config');
  console.log('  The app will show setup instructions to users');
}

// Ensure output directory exists
const outputDir = path.join(__dirname, 'public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the processed HTML
const outputPath = path.join(outputDir, 'index.html');
fs.writeFileSync(outputPath, html);

console.log('✓ Build complete! Output: public/index.html');

// Copy any additional static files if they exist
const staticFiles = ['vercel.json', '.env.example'];
staticFiles.forEach(file => {
  const srcPath = path.join(__dirname, file);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(outputDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file}`);
  }
});

console.log('🚀 Ready for deployment!');