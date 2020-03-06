/**
 * Service Worker boilerplate
 * 
 * This service worker has the bare minimum of features required 
 * to qualify for PWA installation. Use this as a starting point
 * to build out your own caching strategy and other PWA features.
 */

self.addEventListener('install', function(event){
    console.log('[SW] installing...');
    event.waitUntil(caches.open('static')
        .then(function(cache){
            console.log('[SW] precaching');
            cache.addAll([
                '/',
                '/index.html',
                '/app-shell.css'
            ]);
        }));
});

self.addEventListener('activate', function(event){
    console.log('[SW] activating...');
    self.clients.claim();
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                if(response){
                    return response;
                }else{
                    return fetch(event.request);
                }
            })
    );
});