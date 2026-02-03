import admin from 'firebase-admin';

let initialized = false;

export function initializeFirebaseAdmin() {
    if (initialized) return;

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
        console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required but missing. Firebase Admin features will be disabled.');
        return;
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountKey);

        // Check for valid private key to avoid crash
        if (!serviceAccount.private_key) {
            console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is present but missing "private_key". Firebase Admin features will be disabled.');
            return;
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });

        initialized = true;
    } catch (error) {
        console.error('⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin:', error);
    }
}

// Initialize on import
initializeFirebaseAdmin();

// Safe export helper
const getSafeService = <T>(serviceName: string, getter: () => T): T => {
    try {
        if (admin.apps.length === 0) {
            // Return a proxy that logs a warning when accessed
            return new Proxy({} as T, {
                get: (_target, prop) => {
                    console.warn(`Attempted to access ${serviceName}.${String(prop)} but Firebase Admin is not initialized.`);
                    return () => { throw new Error(`Firebase Admin ${serviceName} not initialized`); };
                }
            });
        }
        return getter();
    } catch (e) {
        return {} as T;
    }
};

// Export Firebase Admin services safely
export const adminAuth = getSafeService('auth', () => admin.auth());
export const adminDb = getSafeService('firestore', () => admin.firestore());
export const adminStorage = getSafeService('storage', () => admin.storage());

// Convenient aliases
export const auth = adminAuth;
export const db = adminDb;
export const storage = adminStorage;

export default admin;
