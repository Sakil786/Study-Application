# 📚 Study Log Application

A beautiful, feature-rich study tracking application powered by Firebase. Track your daily study sessions, manage subjects, monitor progress, and build study streaks with real-time cloud synchronization.

![Study Log Preview](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-Powered-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🔐 **User Authentication**
- Secure signup and login with email/password
- Personal study data isolation
- Cross-device synchronization

### 📊 **Study Tracking**
- Create custom subjects with color coding
- Log study sessions with topic, notes, and duration
- Understanding level tracking (1-5 dots system)
- Date-based organization

### 📈 **Progress Analytics**
- Daily study streaks calculation
- Weekly and total study time
- Subject-wise time breakdown with visual charts
- Entry count statistics

### 🎨 **Beautiful Interface**
- Paper-inspired design with clean typography
- Responsive layout for desktop and mobile
- Timeline view of all study sessions
- Real-time search and filtering

## 🚀 Live Demo

Visit: [https://study-application-three.vercel.app/](https://study-application-three.vercel.app/)

## 🔧 Setup Instructions

### Firebase Setup (Required)
This app uses Firebase for authentication and data storage. Setup is **free** and takes 5-10 minutes.

**📋 Quick Setup:**
1. Follow the detailed instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Create a Firebase project (free)
3. Enable Authentication and Firestore
4. Update the `firebaseConfig` in `index.html` with your project's keys

### Deploy to Vercel

**Option A — Vercel CLI (fastest):**
```bash
git clone https://github.com/Sakil786/Study-Application.git
cd Study-Application
vercel --prod
```

**Option B — Vercel Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Deploy with default settings

## 📱 How to Use

### Getting Started
1. **Sign Up**: Create an account with your email
2. **Add Subjects**: Create subjects for different topics you study
3. **Log Sessions**: Record your study sessions with details
4. **Track Progress**: Monitor your streaks and analytics

### Daily Workflow
1. Open the app and sign in
2. Select today's subject
3. Add topic and study notes
4. Set minutes studied and understanding level (1-5 dots)
5. Save entry and watch your progress grow

## 💰 Cost & Scaling

### Firebase Free Tier (Perfect for Personal Use)
- **Authentication**: Unlimited users
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Hosting**: 10GB storage

**For personal study tracking:** You'll use less than 1% of free limits!

## 🏗️ Technical Architecture

- **Frontend**: Pure HTML/CSS/JavaScript with Firebase SDK
- **Backend**: Firebase Authentication + Firestore
- **Data**: Real-time cloud sync with user isolation
- **Security**: Firestore rules ensure data privacy

## 🛡️ Security & Privacy

- ✅ User data is completely isolated (private to each account)
- ✅ Passwords handled securely by Firebase Auth
- ✅ Firestore security rules prevent unauthorized access
- ✅ No personal data sharing or tracking

## 📞 Support

If you need help:
1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for setup instructions
2. Look at browser console for error messages
3. Create an issue on GitHub with details

## 🤝 Contributing

Contributions welcome! Fork the repo, make your changes, and submit a pull request.

---

**Built with ❤️ for students who want to track their learning journey.**
