# Docker Setup Guide

This guide explains how to build and run the Company Panel SaaS application with Docker, including proper Firebase configuration.

## Prerequisites

1. Docker and Docker Compose installed
2. Firebase project set up with Web Push notifications enabled
3. Environment variables configured

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://your-api-server:9005

   # Firebase Configuration (get these from Firebase Console)
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_FIREBASE_VAPID_KEY=your_vapid_key
   ```

## Building and Running

### Option 1: Using Docker Compose (Recommended)

1. Build and start the application:
   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:8080`

### Option 2: Using Docker Commands

1. Build the production image:
   ```bash
   docker build --target production -t company-panel-saas .
   ```

2. Run the container with environment variables:
   ```bash
   docker run -d \
     --name company-panel \
     -p 8080:80 \
     --env-file .env \
     company-panel-saas
   ```

### Option 3: Development Mode

1. Build development image:
   ```bash
   docker build --target development -t company-panel-saas-dev .
   ```

2. Run development container:
   ```bash
   docker run -d \
     --name company-panel-dev \
     -p 5173:5173 \
     -v $(pwd):/app \
     -v /app/node_modules \
     --env-file .env \
     company-panel-saas-dev
   ```

## How It Works

### Production Build Process

1. **Build Stage**: The application is built with Vite, creating static files in `/dist`
2. **Runtime Configuration**: The `docker-entrypoint.sh` script runs at container startup
3. **Environment Injection**: Firebase credentials are injected into `firebase-config.js`
4. **Server Start**: Nginx serves the configured application

### Key Files

- `Dockerfile`: Multi-stage build for development and production
- `docker-entrypoint.sh`: Runtime environment variable injection
- `public/firebase-config.js`: Template file with placeholders
- `nginx.conf`: Nginx configuration for SPA routing

## Troubleshooting

### Firebase Notifications Not Working

1. Check that all Firebase environment variables are set:
   ```bash
   docker exec -it company-panel env | grep FIREBASE
   ```

2. Verify the firebase-config.js was properly updated:
   ```bash
   docker exec -it company-panel cat /usr/share/nginx/html/firebase-config.js
   ```

3. Check browser console for Firebase errors

### API Connection Issues

1. Ensure `VITE_API_BASE_URL` points to the correct API server
2. Check that the API server is accessible from the Docker container
3. Verify CORS settings on your API server

### Container Logs

View container logs for debugging:
```bash
docker logs company-panel
```

## Security Notes

- Never commit `.env` files with real credentials
- Use Docker secrets or external secret management in production
- Ensure your Firebase project has proper security rules
- The VAPID key should be kept secure and not exposed in client-side code logs
