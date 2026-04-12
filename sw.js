 // sw.js - MontCode™ Tactical Sentinel (v6.2 Professional)
// -----------------------------------------------------------------------

// 1. Instalación y Control Inmediato
self.addEventListener('install', (event) => {
    console.log('[SW] Instalado: MontCode™ Sentinel listo.');
    self.skipWaiting();
});

// 2. Activación y Limpieza de Caché
self.addEventListener('activate', (event) => {
    console.log('[SW] Activo: Escuchando pulsos de alta prioridad.');
    event.waitUntil(clients.claim()); 
});

// 3. Manejador de Notificaciones Push (FCM Integration)
// Este es el corazón de la comunicación con la app cerrada.
self.addEventListener('push', function(event) {
    let data = {
        title: '🚨 RESCUE ALERT',
        body: 'Emergency detected. Tap to open tactical map.',
        name: 'Patient'
    };

    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        console.warn('[SW] Push data no era JSON, usando fallback.');
    }

    const options = {
        body: data.body,
        icon: 'logo.png.jpg',
        badge: 'logo.png.jpg',
        vibrate: [500, 100, 500, 100, 500, 100, 500], // Patrón de emergencia
        tag: 'rescue-id-' + (data.patientID || 'emergency'), // Agrupa si es el mismo paciente
        renotify: true,
        requireInteraction: true, // CRÍTICO: La notificación no se va sola.
        priority: 'high',
        data: {
            url: self.location.origin // Guarda la URL para abrirla al hacer click
        },
        actions: [
            { action: 'open', title: 'VIEW MAP' },
            { action: 'close', title: 'DISMISS' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 4. Lógica de Interacción (Click)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'close') return;

    // Intentar reenfocar la app o abrir una nueva ventana
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if (client.visibilityState === 'hidden' || client.visibilityState === 'visible') {
                    if ('focus' in client) return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
