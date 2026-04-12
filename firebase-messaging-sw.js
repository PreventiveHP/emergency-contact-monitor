importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuración de Firebase integrada
const firebaseConfig = {
    apiKey: "AIzaSyDVIQ4S-w4Ag40uYuArW3o7Hw2XQwoQV7U",
    authDomain: "montcode-e02c7.firebaseapp.com",
    databaseURL: "https://montcode-e02c7-default-rtdb.firebaseio.com",
    projectId: "montcode-e02c7",
    storageBucket: "montcode-e02c7.firebasestorage.app",
    messagingSenderId: "988300151844",
    appId: "1:988300151844:web:b1a31275a9555de98a9cb1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejo de mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Alerta SOS detectada:', payload);

    const notificationTitle = payload.notification?.title || '🚨 SOS CRÍTICO - MONTCODE™';
    const notificationOptions = {
        body: payload.notification?.body || 'Asistencia requerida de inmediato.',
        icon: 'logo.png.jpg',
        badge: 'logo.png.jpg',
        tag: 'emergency-alert',
        renotify: true,
        requireInteraction: true,
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110],
        data: { url: '/' }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Abrir la app al tocar la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('/');
        })
    );
});
