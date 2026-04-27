const CACHE = 'uzlayn-tv-v2';
const ASSETS = [
  '/Uzlayn/',
  '/Uzlayn/index.html',
  '/Uzlayn/manifest.json',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET')return;
  if(e.request.url.includes('firebase')||e.request.url.includes('googleapis'))return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var clone=res.clone();
      caches.open(CACHE).then(function(cache){cache.put(e.request,clone);});
      return res;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
