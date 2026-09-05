# 🔥 Firebase Setup Instructions

To enable the full Firebase-powered Study Log application, you need to create your own Firebase project and configure it. This is **free** and takes about 5-10 minutes.

## 📋 Step-by-Step Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `study-log-app` (or any name you prefer)
4. Disable Google Analytics (not needed for this app)
5. Click "Create project"

### 2. Enable Authentication
1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

### 3. Create Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to your users (e.g., us-central1)
5. Click "Done"

### 4. Get Configuration
1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app with nickname: `study-log-web`
6. **Don't check** "Also set up Firebase Hosting"
7. Click "Register app"
8. **Copy the firebaseConfig object**

### 5. Update Your Code
1. Open your `index.html` file
2. Find this section around line 200:
```javascript
const firebaseConfig = {
  apiKey: "demo-api-key-replace-with-your-own",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  // ... other demo values
};
```
3. Replace the entire `firebaseConfig` object with your copied configuration

### 6. Set Up Security Rules (Optional but Recommended)
1. Go back to Firestore Database in Firebase Console
2. Click "Rules" tab
3. Replace the rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /subjects/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /entries/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
4. Click "Publish"

## 🎉 You're Done!

Your Study Log application now has:
- ✅ **Real user authentication** (secure signup/login)
- ✅ **Cloud database** (data syncs across devices)
- ✅ **Multi-user support** (each user has private data)
- ✅ **Automatic backups** (Google's infrastructure)
- ✅ **Cross-device sync** (same data on phone, laptop, tablet)

## 💰 Cost Information

**Free Tier Limits (more than enough for personal use):**
- Authentication: Unlimited users
- Firestore: 1GB storage, 50K reads/day, 20K writes/day
- Hosting: 10GB storage, 360MB/day transfer

**For a personal study log:**
- Daily usage: ~10 reads, ~5 writes
- **You'll use less than 1% of free limits!**

## 🚀 Deploy to Production

### Option 1: Vercel (Current)
Your app will work on Vercel immediately after Firebase configuration.

### Option 2: Firebase Hosting (Alternative)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Select your project
5. Set public directory: `.` (current directory)
6. Deploy: `firebase deploy`

## 🛠️ Troubleshooting

**"Firebase configuration needed" error:**
- Make sure you replaced the entire `firebaseConfig` object
- Check that your API key doesn't contain "demo-api-key"

**"Permission denied" errors:**
- Ensure Firestore security rules are set up correctly
- Make sure users are signed in before accessing data

**Authentication not working:**
- Verify Email/Password is enabled in Firebase Auth
- Check browser console for detailed error messages

## 📞 Support

If you need help:
1. Check the browser console for error messages
2. Verify all steps above are completed
3. Make sure your Firebase project billing is enabled (free tier works fine)
4. Try creating a new Firebase project if issues persist

**Happy studying! 📚**