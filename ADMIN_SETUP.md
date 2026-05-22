# Admin Panel Setup Guide

## Issue: "Permission denied" Error

If you're seeing "Permission denied. Please ensure you are logged in as admin" error, you need to set up admin access in Firestore.

## Step 1: Get Your Firebase Auth UID

1. Open your browser console (F12)
2. In the admin panel, run this in the console:
   ```javascript
   firebase.auth().currentUser.uid
   ```
3. Copy the UID that's displayed

OR

1. Go to Firebase Console → Authentication → Users
2. Find your admin user email
3. Copy the UID shown for that user

## Step 2: Create Admin Document in Firestore

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: **my-mink**
3. Go to **Firestore Database**
4. Click **Start collection** (if Admins collection doesn't exist)
5. Collection ID: `Admins`
6. Document ID: **Paste your UID here** (the UID you copied in Step 1)
7. Click **Save** (you can leave the document empty, it just needs to exist)

## Step 3: Deploy Firestore Rules

The rules have been updated to allow admins to read PushNotifications. Deploy them:

```bash
cd app
firebase deploy --only firestore:rules
```

Or deploy everything:
```bash
firebase deploy
```

## Step 4: Verify

1. Refresh your admin panel
2. Log out and log back in
3. Try accessing the Notifications page again
4. The error should be gone

## Quick Test

After setup, you can test if you're recognized as admin by opening browser console and running:

```javascript
// This should return true if you're an admin
firebase.firestore().collection('Admins').doc(firebase.auth().currentUser.uid).get()
  .then(doc => console.log('Is Admin:', doc.exists))
```

## Troubleshooting

- **Still getting permission denied?**
  - Make sure you deployed the Firestore rules
  - Make sure the document ID in Admins collection matches your exact UID
  - Try logging out and logging back in
  - Clear browser cache

- **Can't find your UID?**
  - Check Firebase Console → Authentication → Users
  - The UID is the long string under each user

