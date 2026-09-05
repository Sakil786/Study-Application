# 🔥 Firebase Setup with Environment Variables

To enable the full Firebase-powered Study Log application, you need to create your own Firebase project and configure it using secure environment variables. This is **free** and takes about 5-10 minutes.

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
8. **Copy the firebaseConfig object values**

### 5. Configure Environment Variables

#### For Vercel Deployment (Recommended):
1. Go to your Vercel dashboard
2. Select your Study Log project
3. Go to "Settings" → "Environment Variables"
4. Add these variables with your Firebase config values:

```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:your-app-id
```

5. Redeploy your application (Vercel will do this automatically)

#### For Local Development:
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. Run `npm run build` to build with your config
4. Run `npm run dev` to test locally

### 6. Set Up Security Rules (Recommended)
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
- ✅ **Secure environment-based configuration**
- ✅ **Real user authentication** (secure signup/login)
- ✅ **Cloud database** (data syncs across devices)
- ✅ **Multi-user support** (each user has private data)
- ✅ **Automatic backups** (Google's infrastructure)
- ✅ **Cross-device sync** (same data on phone, laptop, tablet)

## 🚀 Vercel Environment Variables Setup

After creating your Firebase project:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your Study Log project

2. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add each Firebase config value with **`visibility: config`** (not secret):

| Variable Name | Example Value | Visibility | Description |
|---------------|---------------|------------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyC...` | **config** | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `myapp.firebaseapp.com` | **config** | Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | `my-study-app` | **config** | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `myapp.appspot.com` | **config** | Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | **config** | Sender ID |
| `VITE_FIREBASE_APP_ID` | `1:123:web:abc123` | **config** | App ID |

3. **Important Notes:**
   - ⚠️ **Use `visibility: config`** - Not `secret` (Vercel requirement for VITE_ prefixed variables)
   - ℹ️ **These values are public** - Firebase config is meant to be exposed in client-side code
   - 🔒 **Security comes from Firebase Auth + Firestore rules** - Not from hiding these values

4. **Deploy**
   - Vercel will automatically redeploy with your Firebase config
   - Your app will be ready to use immediately!

## 💰 Cost Information

**Free Tier Limits (more than enough for personal use):**
- Authentication: Unlimited users
- Firestore: 1GB storage, 50K reads/day, 20K writes/day
- Hosting: 10GB storage, 360MB/day transfer

**For a personal study log:**
- Daily usage: ~10 reads, ~5 writes
- **You'll use less than 1% of free limits!**

## 🛠️ Troubleshooting

**Build errors:**
- Make sure all environment variables are set in Vercel
- Check that variable names match exactly (case-sensitive)

**"Firebase configuration needed" error:**
- Verify all 6 environment variables are set
- Redeploy the application after adding variables

**Authentication not working:**
- Ensure Email/Password is enabled in Firebase Auth
- Check browser console for detailed error messages

**Permission denied errors:**
- Ensure Firestore security rules are set up correctly
- Make sure users are signed in before accessing data

## 📞 Support

If you need help:
1. Check Vercel build logs for any error messages
2. Verify all environment variables are correctly set
3. Make sure your Firebase project billing is enabled (free tier works fine)
4. Create an issue on GitHub with details

**Happy studying! 📚**