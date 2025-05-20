const CACHE_NAME = 'hop-tri-thuc-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/service-worker.js',
    '/manifest.json'
];

// Cài đặt Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Đang cache các tài nguyên...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Kích hoạt Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Xóa cache cũ:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Xử lý fetch request
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Trả về response từ cache nếu có
                if (response) {
                    return response;
                }

                // Nếu không có trong cache, thực hiện fetch request
                return fetch(event.request)
                    .then(response => {
                        // Kiểm tra response hợp lệ
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response vì nó chỉ có thể được sử dụng một lần
                        const responseToCache = response.clone();

                        // Thêm response mới vào cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Xử lý lỗi khi offline
                        if (event.request.url.indexOf('.html') > -1) {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
}); 