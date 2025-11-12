import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

function getServiceAccount() {
  try {
    // For local development with a service account file via environment variable
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    }
    // For Firebase/Google Cloud environments that set these variables automatically
    if (process.env.GCP_PROJECT_ID && process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY) {
        return {
            projectId: process.env.GCP_PROJECT_ID,
            clientEmail: process.env.GCP_CLIENT_EMAIL,
            privateKey: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
    }
  } catch (e) {
    console.error('Error parsing service account credentials:', e);
  }
  return undefined;
}

const serviceAccount = getServiceAccount();

let adminApp: App | undefined = getApps().find(app => app.name === 'firebase-admin-app');
let adminDb: Firestore;

if (!adminApp && serviceAccount) {
    adminApp = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: `https:///${firebaseConfig.projectId}.firebaseio.com`,
    }, 'firebase-admin-app');
}

if (adminApp) {
  adminDb = getFirestore(adminApp);
} else {
  // This is a fallback that will likely not work for most admin operations,
  // but it prevents the app from crashing. Proper server-side setup is required.
  console.warn("Firebase Admin SDK not initialized. Server-side actions requiring auth will fail.");
  // @ts-ignore - Allow assignment for fallback.
  adminDb = {} as Firestore;
}


export { adminDb };
