#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the template HTML file
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Get environment variables (Vercel automatically provides these)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'demo-api-key-replace-with-your-own',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo-app-id'
};

// Create the Firebase config string
const configString = JSON.stringify(firebaseConfig, null, 2);

// Replace the placeholder config in the HTML
const placeholder = `const firebaseConfig = {
  // Note: For demo purposes, these are placeholder values
  // Users need to create their own Firebase project and replace these
  apiKey: "demo-api-key-replace-with-your-own",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id"
};`;

const replacement = `const firebaseConfig = ${configString};`;

// Replace in the HTML
html = html.replace(placeholder, replacement);

// Write the built HTML to public directory
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'index.html'), html);

console.log('✅ Build completed! Firebase config injected from environment variables.');
console.log('📋 Config used:');
console.log('  - API Key:', firebaseConfig.apiKey.substring(0, 10) + '...');
console.log('  - Project ID:', firebaseConfig.projectId);
console.log('  - Auth Domain:', firebaseConfig.authDomain);