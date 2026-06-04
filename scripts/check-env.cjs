
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
    console.log('.env file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        acc[match[1].trim()] = match[2].trim();
    }
    return acc;
}, {});

const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'FANAR_API_KEY'
];

console.log('Environment Variable Check:');
requiredKeys.forEach(key => {
    const value = envVars[key];
    const status = value ? (value.length > 5 ? 'SET (Length > 5)' : 'SET (Short)') : 'MISSING';
    console.log(`${key}: ${status}`);
    if (value && value.includes('your-')) {
        console.log(`  WARNING: ${key} seems to contain a placeholder ('your-')`);
    }
});
