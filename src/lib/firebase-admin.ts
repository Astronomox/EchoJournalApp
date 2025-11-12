'use server';

import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

function getServiceAccount() {
  try {
    // For local development with a service account file
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    }
    // For Firebase/Google Cloud environments
    if (process.env.GCP_PROJECT_ID) {
        return {
            projectId: process.env.GCP_PROJECT_ID,
            clientEmail: process.env.GCP_CLIENT_EMAIL,
            privateKey: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }
    }
  } catch (e) {
    console.error('Error parsing service account credentials:', e);
  }
  // Fallback for client-side config if no server-side auth is found
  // Note: This has limited server-side capabilities.
  return undefined;
}


const serviceAccount = getServiceAccount();

const adminApp =
  getApps().find(app => app.name === 'firebase-admin-app') ||
  initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  }, 'firebase-admin-app');


export const adminDb = getFirestore(adminApp);
