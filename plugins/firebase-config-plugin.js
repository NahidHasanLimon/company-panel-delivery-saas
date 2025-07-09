import { writeFileSync } from 'fs'
import { join } from 'path'

export default function firebaseConfigPlugin() {
  let isProduction = false
  let rootPath = ''
  
  return {
    name: 'firebase-config',
    configResolved(config) {
      isProduction = config.command === 'build'
      rootPath = config.root
    },
    buildStart() {
      // Generate firebase-config.js for both dev and build
      generateFirebaseConfig(rootPath)
    },
    generateBundle() {
      // Also generate during build to ensure it's included in dist
      if (isProduction) {
        const firebaseConfig = {
          apiKey: process.env.VITE_FIREBASE_API_KEY || '',
          authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
          storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: process.env.VITE_FIREBASE_APP_ID || '',
          measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
        }

        const configContent = `// Firebase configuration for service worker (auto-generated)
// Generated from environment variables during build
// Compatible with both browser and service worker contexts
(function() {
  const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};
  
  // Make config available in both contexts
  if (typeof window !== 'undefined') {
    // Browser context
    window.firebaseConfig = firebaseConfig;
  } else if (typeof self !== 'undefined') {
    // Service worker context
    self.firebaseConfig = firebaseConfig;
  } else {
    // Node.js or other contexts
    global.firebaseConfig = firebaseConfig;
  }
})();`

        this.emitFile({
          type: 'asset',
          fileName: 'firebase-config.js',
          source: configContent
        })
      }
    }
  }
}

function generateFirebaseConfig(rootPath) {
  // Read environment variables
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || '',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.VITE_FIREBASE_APP_ID || '',
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
  }

  // Check if any required env vars are missing
  const requiredVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID']
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  let configContent
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing Firebase environment variables: ${missingVars.join(', ')}`)
    configContent = `// Firebase configuration missing!
// Please set the following environment variables: ${missingVars.join(', ')}
console.warn('Firebase configuration incomplete. Missing: ${missingVars.join(', ')}');
(function() {
  const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};
  
  // Make config available in both contexts
  if (typeof window !== 'undefined') {
    window.firebaseConfig = firebaseConfig;
  } else if (typeof self !== 'undefined') {
    self.firebaseConfig = firebaseConfig;
  } else {
    global.firebaseConfig = firebaseConfig;
  }
})();`
  } else {
    configContent = `// Firebase configuration for service worker (auto-generated)
// Generated from environment variables
// Compatible with both browser and service worker contexts
(function() {
  const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};
  
  // Make config available in both contexts
  if (typeof window !== 'undefined') {
    // Browser context
    window.firebaseConfig = firebaseConfig;
  } else if (typeof self !== 'undefined') {
    // Service worker context
    self.firebaseConfig = firebaseConfig;
  } else {
    // Node.js or other contexts
    global.firebaseConfig = firebaseConfig;
  }
})();`
  }

  // Write to public directory for development
  const publicConfigPath = join(rootPath || process.cwd(), 'public', 'firebase-config.js')
  writeFileSync(publicConfigPath, configContent)
  
  if (missingVars.length === 0) {
    console.log('✅ Generated firebase-config.js with environment variables')
  }
}
