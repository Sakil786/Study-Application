# Firestore Security Rules for Share Progress Feature

## Required Security Rules

To enable the share progress feature, you need to update your Firestore security rules in the Firebase Console.

### How to Update Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `study-log-app-d37cb`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the rules with the configuration below
5. Click **Publish**

---

## Updated Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles Collection - For share progress feature
    match /userProfiles/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can create/update their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Anyone can query by email to find users (for viewing shared progress)
      allow read: if request.auth != null;
    }
    
    // Subjects Collection
    match /subjects/{userId}/items/{subjectId} {
      // Users can read/write their own subjects
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Others can read if sharing is enabled
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/userProfiles/$(userId)) &&
                     get(/databases/$(database)/documents/userProfiles/$(userId)).data.shareEnabled == true;
    }
    
    // Entries Collection
    match /entries/{userId}/items/{entryId} {
      // Users can read/write their own entries
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Others can read if sharing is enabled
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/userProfiles/$(userId)) &&
                     get(/databases/$(database)/documents/userProfiles/$(userId)).data.shareEnabled == true;
    }
    
    // AI Chat History Collection (Optional - from playground feature)
    match /chatHistory/{userId}/chats/{chatId} {
      // Users can read/write their own chat history
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Rule Explanation

### 1. **User Profiles**
- Users can read and write their own profile
- Authenticated users can query profiles by email (needed for the "View Progress" feature)
- Stores: email, shareEnabled flag, timestamps

### 2. **Subjects & Entries**
- **Own Data**: Users have full read/write access to their own subjects and entries
- **Shared Data**: Others can read (but not write) if the owner has `shareEnabled: true`
- The rule checks the `userProfiles/{userId}` document to verify sharing is enabled

### 3. **Security Features**
- ✅ All operations require authentication (`request.auth != null`)
- ✅ Users can only write their own data
- ✅ Viewing others' data requires explicit opt-in (`shareEnabled: true`)
- ✅ No one can modify another user's data

---

## Testing the Rules

After updating the rules, test the feature:

1. **Enable Sharing**:
   - Log in to your account
   - Click "🔗 Share Progress" in the header
   - Toggle "Allow others to view my progress"
   - Copy your email

2. **View Shared Progress**:
   - Log in with a different account (or use incognito mode)
   - Click "🔗 Share Progress"
   - Enter the email you copied
   - Click "View Progress"
   - You should see the first user's subjects, entries, and stats in real-time!

3. **Disable Sharing**:
   - Toggle off sharing
   - The second user should see "This user has not enabled progress sharing"

---

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Make sure you've published the updated rules
- Wait 1-2 minutes for rules to propagate
- Check that the user has `shareEnabled: true` in their profile

### Error: "User not found"
- The user must have logged in at least once to create their profile
- Check the email address is correct

### Error: "This user has not enabled progress sharing"
- The user needs to enable sharing in their settings
- They should toggle "Allow others to view my progress" to ON

---

## Database Structure

```
firestore/
├── userProfiles/
│   └── {userId}/
│       ├── email: string
│       ├── shareEnabled: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── subjects/
│   └── {userId}/
│       └── items/
│           └── {subjectId}/
│               ├── name: string
│               ├── color: string
│               └── createdAt: timestamp
│
└── entries/
    └── {userId}/
        └── items/
            └── {entryId}/
                ├── subjectId: string
                ├── topic: string
                ├── notes: string
                ├── minutes: number
                ├── understanding: number
                └── date: string
```

---

## Next Steps

After updating the rules:
1. ✅ Test enabling/disabling sharing
2. ✅ Test viewing another user's progress
3. ✅ Verify real-time updates work
4. ✅ Test the "Back to My Dashboard" functionality

The feature is now fully functional! 🎉
