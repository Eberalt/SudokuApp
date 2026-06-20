const CACHE_NAME = 'sudoku-v1';
// Lista plików, które chcemy zapisać w pamięci telefonu
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Instalacja Service Workera i zapisanie plików w Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serwowanie plików z pamięci podręcznej, gdy jesteśmy offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Jeśli plik jest w pamięci - zwróć go, w przeciwnym razie pobierz z sieci
      return cachedResponse || fetch(e.request);
    })
  );
});