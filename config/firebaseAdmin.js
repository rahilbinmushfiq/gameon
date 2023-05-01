import { getApp, getApps, cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Function to retrieve the Firebase Admin app instance
function getFirebaseAdminApp() {
  // Check for existing Firebase Admin app instances
  if (!getApps().length) {
    // If no app instances exist, initialize a new app with the credentials
    return initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
  } else {
    // If an app instance already exists, return that instance
    return getApp();
  }
}

export const adminApp = getFirebaseAdminApp();
export const adminAuth = getAuth(adminApp);
