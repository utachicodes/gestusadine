/**
 * Initialize Firestore Collections
 * Run this script to set up the required Firestore collections and documents
 * 
 * Usage: tsx backend/scripts/init-firestore.ts
 */

import { db } from '../services/api-gateway/src/lib/firebase-admin.js';

async function initializeFirestore() {
    console.log('🚀 Initializing Firestore collections...');

    try {
        // 1. Create config collection with default settings
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Created config/app-settings');
        } else {
            console.log('⏭️  config/app-settings already exists');
        }

        // 2. Create system user for initialization
        const systemUserRef = db.collection('users').doc('system');
        const systemUserSnapshot = await systemUserRef.get();

        if (!systemUserSnapshot.exists) {
            await systemUserRef.set({
                email: 'system@deenakdiamano.com',
                role: 'system',
                displayName: 'System',
                createdAt: new Date().toISOString()
            });
            console.log('✅ Created users/system');
        } else {
            console.log('⏭️  users/system already exists');
        }

        // 3. Initialize empty collections (create with placeholder)
        const collections = [
            { name: 'documents', placeholder: 'init' },
            { name: 'vectors', placeholder: 'init' },
            { name: 'user_activity', placeholder: 'init' },
            { name: 'daily_content', placeholder: 'init' },
            { name: 'videos', placeholder: 'init' },
            { name: 'library_books', placeholder: 'init' },
            { name: 'events', placeholder: 'init' }
        ];

        for (const collection of collections) {
            const placeholderRef = db.collection(collection.name).doc('_placeholder');
            const snapshot = await placeholderRef.get();

            if (!snapshot.exists) {
                await placeholderRef.set({
                    _placeholder: true,
                    note: 'This document exists to initialize the collection. It can be safely deleted.',
                    createdAt: new Date().toISOString()
                });
                console.log(`✅ Created ${collection.name} collection`);
            } else {
                console.log(`⏭️  ${collection.name} collection already exists`);
            }
        }

        // 4. Verify connection by reading back
        console.log('\n🔍 Verifying Firestore connection...');
        const configCheck = await configRef.get();
        if (configCheck.exists) {
            console.log('✅ Successfully read from Firestore');
            console.log('📊 Config data:', configCheck.data());
        }

        // 5. List all collections
        console.log('\n📋 Firestore Collections:');
        const allCollections = await db.listCollections();
        allCollections.forEach(collection => {
            console.log(`  - ${collection.id}`);
        });

        console.log('\n✅ Firestore initialization complete!');
        console.log('💡 You can now restart your dev server - the NOT_FOUND errors should be resolved.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing Firestore:', error);
        console.error('\nTroubleshooting:');
        console.error('1. Verify FIREBASE_SERVICE_ACCOUNT_KEY is set in .env');
        console.error('2. Check that the service account has Firestore access');
        console.error('3. Ensure Firestore database is created in Firebase Console');
        process.exit(1);
    }
}

// Run initialization
initializeFirestore();
