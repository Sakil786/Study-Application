# 🚀 Deployment Guide

This guide shows you how to deploy your Study Log application with Firebase configuration using environment variables.

## 🔧 Prerequisites

1. **Firebase Project**: Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to create your Firebase project
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free)
3. **GitHub Repository**: Fork or clone this repository

## 📦 Deployment Steps

### Step 1: Prepare Your Environment Variables

From your Firebase project configuration, you'll need these 6 values:

```javascript
// From Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // → VITE_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",   // → VITE_FIREBASE_AUTH_DOMAIN  
  projectId: "my-project-id",              // → VITE_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",    // → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",          // → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123"          // → VITE_FIREBASE_APP_ID
};
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. **Import Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your Study Log repository

2. **Configure Build Settings**
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `public`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - In the deployment setup, click "Environment Variables"
   - Add all 6 Firebase variables with **`visibility: config`**:
   
   | Name | Value | Visibility |
   |------|-------|------------|
   | `VITE_FIREBASE_API_KEY` | Your Firebase API key | **config** |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain | **config** |
   | `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID | **config** |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket | **config** |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase sender ID | **config** |
   | `VITE_FIREBASE_APP_ID` | Your Firebase app ID | **config** |

   **⚠️ Important:** Use `visibility: config` (not `secret`) for all VITE_ prefixed variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a live URL when deployment completes

#### Option B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd Study-Application
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### Step 3: Verify Deployment

1. **Visit Your App**
   - Open the Vercel-provided URL
   - You should see the Study Log login/signup screen

2. **Test Authentication**
   - Try creating a new account
   - Verify you can log in successfully

3. **Test Core Features**
   - Add a study subject
   - Create a study entry
   - Check that data persists after refresh

## 🔄 Updating Your Deployment

### For Code Changes:
1. Push changes to your GitHub repository
2. Vercel automatically redeploys

### For Environment Variable Changes:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update the values as needed
3. Redeploy from the Deployments tab

## 🌐 Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add your custom domain
   - Follow the DNS configuration instructions

2. **Update Firebase Configuration:**
   - Go to Firebase Console → Authentication → Settings
   - Add your custom domain to "Authorized domains"

## 🛠️ Local Development

To test locally with your Firebase configuration:

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Add your Firebase config**
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:your-app-id
   ```

3. **Build and serve**
   ```bash
   npm run build
   npm run dev
   ```

## 🛠️ Troubleshooting

### Build Fails
- **Check environment variables**: Ensure all 6 Firebase variables are set
- **Verify variable names**: Must match exactly (case-sensitive)
- **Check visibility setting**: Use `visibility: config` for VITE_ prefixed variables
- **Check build logs**: Look for specific error messages in Vercel dashboard

### "Environment variables with a public framework prefix cannot use `visibility: secret`"
- **Solution**: Change all VITE_ variables to use `visibility: config` instead of `secret`
- **Why**: Vercel requires this for public framework prefixes like VITE_, NEXT_PUBLIC_, etc.
- **Security**: This is correct - Firebase config is meant to be public in client-side apps

### App Shows "Firebase Configuration Required"
- **Environment variables not set**: Add them in Vercel dashboard
- **Incorrect values**: Double-check Firebase config values
- **Wrong visibility**: Ensure all variables use `visibility: config`
- **Redeploy needed**: Trigger a new deployment after adding variables

### Authentication Doesn't Work
- **Firebase Auth not enabled**: Enable Email/Password in Firebase Console
- **Domain not authorized**: Add your domain to Firebase Auth settings
- **Network errors**: Check browser console for specific error messages

### Data Not Persisting
- **Firestore not created**: Ensure Firestore database is set up
- **Security rules**: Verify Firestore rules allow authenticated access
- **User not signed in**: Check authentication status

## 📞 Support

If you encounter issues:

1. **Check Vercel build logs** in your dashboard
2. **Verify Firebase setup** using [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
3. **Test locally** to isolate the issue
4. **Create GitHub issue** with detailed error information

## 🎉 Success!

Once deployed, your Study Log application will have:

- ✅ **Secure Firebase authentication**
- ✅ **Real-time cloud database**  
- ✅ **Cross-device synchronization**
- ✅ **Professional hosting with SSL**
- ✅ **Automatic deployments from Git**
- ✅ **Environment-based configuration**

Your users can now sign up, track their study sessions, and access their data from anywhere!

**Happy studying! 📚**