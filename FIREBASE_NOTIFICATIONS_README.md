# Firebase Web Push Notifications Setup

This project has been integrated with Firebase Cloud Messaging (FCM) for web push notifications.

## 🚀 Features

- Real-time push notifications
- Foreground and background message handling
- Notification permission management
- Persistent notification storage
- Integration with existing notification system

## 📋 Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your Firebase credentials:

```bash
cp .env.example .env
```

Update your `.env` file with your Firebase project credentials:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:9005

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 2. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select or create your project
3. Go to **Project Settings** > **General** tab
4. In **Your apps** section, find your web app or create one
5. Copy the configuration values to your `.env` file

### 3. Get VAPID Key

1. In Firebase Console, go to **Project Settings** > **Cloud Messaging** tab
2. In **Web configuration** section, generate or copy your **Web Push certificates** (VAPID key)
3. Add it to your `.env` file as `VITE_FIREBASE_VAPID_KEY`

### 4. Install Dependencies

```bash
npm install
```

### 5. Build Configuration

The project uses a custom Vite plugin that automatically generates the Firebase configuration for the service worker during build, using your environment variables.

For development, a fallback configuration file is used.

### 3. Backend Integration

Update your backend API to handle FCM token storage:

#### Endpoint: `POST /api/fcm-token`

```json
{
  "fcm_token": "string",
  "device_type": "web"
}
```

### 4. Sending Notifications from Backend

Use Firebase Admin SDK in your backend to send notifications:

```php
// Example using Firebase Admin SDK for PHP
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

$factory = (new Factory)->withServiceAccount('path/to/service-account.json');
$messaging = $factory->createMessaging();

$message = CloudMessage::fromArray([
    'token' => $fcmToken, // From your database
    'notification' => [
        'title' => 'New Delivery Assignment',
        'body' => 'You have been assigned delivery #DEL-001'
    ],
    'data' => [
        'delivery_id' => '1',
        'type' => 'delivery_assigned',
        'url' => '/deliveries/1'
    ],
    'webpush' => [
        'headers' => [
            'TTL' => '300'
        ],
        'notification' => [
            'icon' => '/icon-192x192.png',
            'badge' => '/badge-72x72.png',
            'requireInteraction' => true,
            'actions' => [
                [
                    'action' => 'view',
                    'title' => 'View Details'
                ],
                [
                    'action' => 'dismiss',
                    'title' => 'Dismiss'
                ]
            ]
        ]
    ]
]);

$messaging->send($message);
```

## 🔧 Configuration Files

### Firebase Config (`/src/firebase/config.js`)
- Contains Firebase project configuration
- Exports messaging instance and methods

### Service Worker (`/public/firebase-messaging-sw.js`)
- Handles background notifications
- Manages notification clicks and actions

### Notification Service (`/src/services/notificationService.js`)
- Manages permission requests
- Handles token generation and storage
- Listens for foreground messages

### Notification Store (`/src/stores/notification.js`)
- Pinia store for notification state management
- Handles notification display and interactions

## 🎯 Usage

### 1. Initialize Notifications
Notifications are automatically initialized when the app starts.

### 2. Request Permission
Users will see a banner prompting them to enable notifications. They can also enable it manually.

### 3. Handle Notifications
- **Foreground**: Notifications show as browser notifications
- **Background**: Handled by service worker
- **Clicks**: Navigate to relevant pages

## 📱 Notification Types

Configure different notification types based on your needs:

```javascript
// Example notification data structure
{
  type: 'delivery_assigned',
  title: 'New Delivery Assignment',
  body: 'You have been assigned delivery #DEL-001',
  data: {
    delivery_id: '1',
    url: '/deliveries/1'
  }
}
```

## 🛠 Testing

### Test Notifications in Development

1. Enable notifications in your browser
2. Check browser console for FCM token
3. Use Firebase Console to send test messages
4. Or use your backend API to send notifications

### Browser Support

- Chrome 50+
- Firefox 44+
- Safari 16+ (macOS 13+)
- Edge 17+

## 🚨 Troubleshooting

### Common Issues

1. **No token generated**: Check VAPID key configuration
2. **Permission denied**: User needs to enable notifications manually
3. **Service worker not working**: Ensure `/firebase-messaging-sw.js` is accessible
4. **Notifications not showing**: Check browser notification settings

### Debug Mode

Enable debug logging by checking browser console for:
- FCM token generation
- Permission status
- Message reception
- Service worker registration

## 📁 File Structure

```
src/
├── firebase/
│   └── config.js              # Firebase configuration
├── services/
│   └── notificationService.js # Notification management
├── stores/
│   └── notification.js        # Pinia store
├── components/
│   └── NotificationPermissionBanner.vue
public/
└── firebase-messaging-sw.js   # Service worker
```

## 🔐 Security Considerations

1. Keep your Firebase API keys secure
2. Validate FCM tokens on your backend
3. Implement proper user authentication for token storage
4. Use HTTPS in production (required for push notifications)

## 📈 Next Steps

1. Add notification icons and badges
2. Implement notification categories
3. Add notification analytics
4. Create admin panel for sending notifications
5. Add notification preferences/settings

The Firebase web push notification system is now fully integrated and ready to use!
