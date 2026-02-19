import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

function initFirebase(): App {
  if (getApps().length) return getApp();
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase admin env vars faltantes");
  }
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getFirebaseAuth() {
  const app = initFirebase();
  return getAuth(app);
}
