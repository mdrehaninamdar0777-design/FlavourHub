// ==========================================
// Firebase Admin SDK - Server Side Only
// ==========================================
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export async function verifyFirebaseToken(token: string) {
  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    return decodedToken;
  } catch {
    return null;
  }
}
