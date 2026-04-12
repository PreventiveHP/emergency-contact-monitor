 // sw.js - Service Worker Centinela (Background)
// -----------------------------------------------------------------------

// 1. Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Instalado - Centinela listo.');
    self.skipWaiting();
});

// 2. Activación
self.addEventListener('activate', (event) => {
    console.log('[SW] Activo - Escuchando pulsos de Firebase.');
});

// 3. Manejador de Notificaciones Push (Background)
self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    const title = data.title || '🚨 ALERTA DE RESCATE: MONTPATH';
    const options = {
        body: data.body || 'Se ha detectado una emergencia activa. Pulse para ver detalles.',
        icon: 'logo.png.jpg',
        badge: 'logo.png.jpg',
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40],
        tag: 'rescue-notification', // Evita que se amontonen las notificaciones
        renotify: true,
        requireInteraction: true, // No desaparece hasta que el familiar la toque
        actions: [
            { action: 'open', title: 'VER MAPA TÁCTICO' },
            { action: 'close', title: 'SILENCIAR' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 4. Lógica al tocar la notificación
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'close') {
        return; // Solo cierra la alerta
    }

    // Si toca la notificación, abre la aplicación del Monitor
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Si la app ya está abierta, ponle el foco
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Si no está abierta, ábrela
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
