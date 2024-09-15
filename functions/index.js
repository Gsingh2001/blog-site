const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { default: next } = require('next');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set up Next.js app
const isDev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev: isDev, conf: { distDir: '.next' } });
const handle = nextApp.getRequestHandler();

// Deploy Next.js with Firebase Functions
exports.nextjs = functions.https.onRequest((req, res) => {
  return nextApp.prepare().then(() => handle(req, res));
});
