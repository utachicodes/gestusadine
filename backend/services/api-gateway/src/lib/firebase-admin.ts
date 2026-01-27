import admin from 'firebase-admin';

let initialized = false;

export function initializeFirebaseAdmin() {
    if (initialized) return;

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required');
    }

    const serviceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    initialized = true;
}

// Initialize on import
initializeFirebaseAdmin();

// Export Firebase Admin services
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

// Convenient aliases
export const auth = adminAuth;
export const db = adminDb;
export const storage = adminStorage;

export default admin;
