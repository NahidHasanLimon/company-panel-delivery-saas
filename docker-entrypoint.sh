#!/bin/sh

# Docker entrypoint script for replacing environment variables in static files
# This script runs before starting the web server

echo "🔧 Configuring Firebase for Docker environment..."

# Determine if we're in development or production mode
if [ -f "/app/public/firebase-config.js" ]; then
    # Development mode - files are in /app/public/
    CONFIG_FILE="/app/public/firebase-config.js"
    echo "📝 Development mode detected"
elif [ -f "/usr/share/nginx/html/firebase-config.js" ]; then
    # Production mode - files are in nginx html directory
    CONFIG_FILE="/usr/share/nginx/html/firebase-config.js"
    echo "🚀 Production mode detected"
else
    echo "❌ firebase-config.js not found in either development or production location!"
    CONFIG_FILE=""
fi

# Replace placeholders in firebase-config.js with actual environment variables
if [ -n "$CONFIG_FILE" ]; then
    sed -i "s|__VITE_FIREBASE_API_KEY__|${VITE_FIREBASE_API_KEY}|g" "$CONFIG_FILE"
    sed -i "s|__VITE_FIREBASE_AUTH_DOMAIN__|${VITE_FIREBASE_AUTH_DOMAIN}|g" "$CONFIG_FILE"
    sed -i "s|__VITE_FIREBASE_PROJECT_ID__|${VITE_FIREBASE_PROJECT_ID}|g" "$CONFIG_FILE"
    sed -i "s|__VITE_FIREBASE_STORAGE_BUCKET__|${VITE_FIREBASE_STORAGE_BUCKET}|g" "$CONFIG_FILE"
    sed -i "s|__VITE_FIREBASE_MESSAGING_SENDER_ID__|${VITE_FIREBASE_MESSAGING_SENDER_ID}|g" "$CONFIG_FILE"
    sed -i "s|__VITE_FIREBASE_APP_ID__|${VITE_FIREBASE_APP_ID}|g" "$CONFIG_FILE"
    sed -i "s|__VITE_FIREBASE_MEASUREMENT_ID__|${VITE_FIREBASE_MEASUREMENT_ID}|g" "$CONFIG_FILE"
    
    echo "✅ Firebase configuration updated with environment variables in $CONFIG_FILE"
fi

# Also replace placeholders in any built JS files that might contain environment variables
find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|__VITE_API_BASE_URL__|${VITE_API_BASE_URL}|g" {} \;

echo "🚀 Starting nginx..."

# Execute the original command (start nginx)
exec "$@"
