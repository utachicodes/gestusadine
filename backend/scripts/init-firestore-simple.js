/**
 * Simplified Firestore Initialization Script
 * Creates all required Firestore collections and documents
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Firebase Admin
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
    console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env');
    process.exit(1);
}

try {
    const serviceAccount = JSON.parse(serviceAccountKey);

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
    }

    console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    process.exit(1);
}

const db = admin.firestore();

async function initializeFirestore() {
    console.log('🚀 Initializing Firestore collections...\n');

    try {
        // 1. Create config collection with app-settings
        console.log('Creating config/app-settings...');
        const configRef = db.collection('config').doc('app-settings');
        const configSnapshot = await configRef.get();

        if (!configSnapshot.exists) {
            await configRef.set({
                appName: 'DeenAkDiamano',
                version: '1.0.0',
                features: {
                    chat: true,
                    library: true,
                    videos: true,
                    subscriptions: true,
                    translation: true,
                    rag: true
                },
                theme: {
                    primaryColor: '#10b981',
                    darkMode: true
                },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('  ✅ Created config/app-settings');
        } else {
            console.log('  ⏭️  config/app-settings already exists');
        }

        // 2. Create system_config collection with default document
        console.log('\nCreating system_config/default...');
        const systemConfigRef = db.collection('system_config').doc('default');
        const systemConfigSnapshot = await systemConfigRef.get();

        if (!systemConfigSnapshot.exists) {
            await systemConfigRef.set({
                config: {
                    agents: {
                        'agent-fiqh': {
                            agentId: 'agent-fiqh',
                            agentName: 'Fiqh Reasoning Agent',
                            modelId: 'meta-llama/llama-3.3-70b-instruct:free',
                            systemPrompt: 'You are the Fiqh Reasoning Agent.',
                            temperature: 0.3,
                            enabled: true,
                            knowledgeBase: 'agent-fiqh'
                        },
                        'agent-aqeedah': {
                            agentId: 'agent-aqeedah',
                            agentName: 'Aqeedah Boundary Agent',
                            modelId: 'meta-llama/llama-3.1-405b-instruct:free',
                            systemPrompt: 'You are the Aqeedah Boundary Agent.',
                            temperature: 0.2,
                            enabled: true,
                            knowledgeBase: 'agent-aqeedah'
                        },
                        'agent-humility': {
                            agentId: 'agent-humility',
                            agentName: 'Humility & Abstention Agent',
                            modelId: 'meta-llama/llama-3.2-3b-instruct:free',
                            systemPrompt: 'You are the Humility & Abstention Agent.',
                            temperature: 0.4,
                            enabled: true,
                            knowledgeBase: 'agent-humility'
                        }
                    },
                    lastUpdated: new Date().toISOString()
                },
                updated_at: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('  ✅ Created system_config/default');
        } else {
            console.log('  ⏭️  system_config/default already exists');
        }

        // 3. Create system user
        console.log('\nCreating users/system...');
        const systemUserRef = db.collection('users').doc('system');
        const systemUserSnapshot = await systemUserRef.get();

        if (!systemUserSnapshot.exists) {
            await systemUserRef.set({
                email: 'system@deenakdiamano.com',
                role: 'system',
                displayName: 'System',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('  ✅ Created users/system');
        } else {
            console.log('  ⏭️  users/system already exists');
        }

        // 4. Initialize empty collections with placeholders
        console.log('\nInitializing empty collections...');
        const collections = [
            'documents',
            'vectors',
            'user_activity',
            'daily_content',
            'videos',
            'library_books',
            'events'
        ];

        for (const collectionName of collections) {
            const placeholderRef = db.collection(collectionName).doc('_placeholder');
            const snapshot = await placeholderRef.get();

            if (!snapshot.exists) {
                await placeholderRef.set({
                    _placeholder: true,
                    note: 'This document exists to initialize the collection. It can be safely deleted.',
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`  ✅ Created ${collectionName} collection`);
            } else {
                console.log(`  ⏭️  ${collectionName} collection already exists`);
            }
        }

        // 5. Verify by listing all collections
        console.log('\n🔍 Verifying Firestore setup...');
        const allCollections = await db.listCollections();
        console.log('\n📋 Available Firestore Collections:');
        allCollections.forEach(collection => {
            console.log(`  ✓ ${collection.id}`);
        });

        console.log('\n✅ Firestore initialization complete!');
        console.log('💡 You can now restart your dev server - the NOT_FOUND errors should be resolved.\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error initializing Firestore:', error);
        console.error('\nTroubleshooting:');
        console.error('1. Verify FIREBASE_SERVICE_ACCOUNT_KEY is set in .env');
        console.error('2. Check that the service account has Firestore access');
        console.error('3. Ensure Firestore database is created in Firebase Console\n');
        process.exit(1);
    }
}

// Run initialization
initializeFirestore();
