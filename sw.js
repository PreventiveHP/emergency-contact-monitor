// sw.js - Service Worker Táctico
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    
    const title = '🚨 MONTPATH RESCUE ALERT';
    const options = {
        body: 'Se ha detectado una emergencia activa. Pulse para ver ubicación.',
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [500, 200, 500, 200, 500],
        tag: 'emergency-notification',
        requireInteraction: true // No desaparece hasta que el familiar la cierre
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Al tocar la notificación, abre la app de monitoreo
    event.waitUntil(
        clients.openWindow('/')
    );
});
