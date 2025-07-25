'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "a74f4c3ce2b9d504665e5c338e8cc9c5",
"assets/AssetManifest.bin.json": "c3a012633a4d79466735da0a3fff9686",
"assets/AssetManifest.json": "938dadb5c2c405d7d537d323f4f5e40e",
"assets/assets/Google-G-Logo.png": "e542199ba63df1aa16735bc0fb630cc3",
"assets/assets/launcher_icon.png": "4b800c6aef0258fb321a20a39627fb3c",
"assets/assets/logo%2520copy.png": "201f8c141de4ea306836967cf75edfe1",
"assets/assets/logo.png": "3c8f6f1a1c545255f4811c83c394f22e",
"assets/assets/splashscreen.png": "9cb24687b4cb4310db6682166e5bf806",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "aac17bb9946e41d85e2e835830199889",
"assets/NOTICES": "70b359d5c9a23e0cade49a502098a032",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"favicon.png": "379ee20ad6528a396fc75bff741d6554",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "c15128139857641dde641f0444b8009d",
"icons/Icon-192.png": "b76a22f2e8460869b7c37cd832655646",
"icons/Icon-512.png": "24ff44499f903d4c73575cb8c19ffa3b",
"icons/Icon-maskable-192.png": "b76a22f2e8460869b7c37cd832655646",
"icons/Icon-maskable-512.png": "24ff44499f903d4c73575cb8c19ffa3b",
"index.html": "55d543ac427c382a49327c84fcc84a54",
"/": "55d543ac427c382a49327c84fcc84a54",
"main.dart.js": "40b685606657eaefd44a697afb3655d3",
"manifest.json": "bd7120eeda8ca2de858e9a425cf36833",
"splash/img/branding-1x.png": "e56716ed3f21e87e3b86d51e1d11d3b8",
"splash/img/branding-2x.png": "4eb05416025724773273ea8edaaf2bcf",
"splash/img/branding-3x.png": "2ca935069a1427667b6d57db91d45823",
"splash/img/branding-4x.png": "5c56bf12d8ac62c544cb8d6cb6b3c599",
"splash/img/branding-dark-1x.png": "e56716ed3f21e87e3b86d51e1d11d3b8",
"splash/img/branding-dark-2x.png": "4eb05416025724773273ea8edaaf2bcf",
"splash/img/branding-dark-3x.png": "2ca935069a1427667b6d57db91d45823",
"splash/img/branding-dark-4x.png": "5c56bf12d8ac62c544cb8d6cb6b3c599",
"splash/img/dark-1x.png": "e56716ed3f21e87e3b86d51e1d11d3b8",
"splash/img/dark-2x.png": "4eb05416025724773273ea8edaaf2bcf",
"splash/img/dark-3x.png": "2ca935069a1427667b6d57db91d45823",
"splash/img/dark-4x.png": "5c56bf12d8ac62c544cb8d6cb6b3c599",
"splash/img/light-1x.png": "e56716ed3f21e87e3b86d51e1d11d3b8",
"splash/img/light-2x.png": "4eb05416025724773273ea8edaaf2bcf",
"splash/img/light-3x.png": "2ca935069a1427667b6d57db91d45823",
"splash/img/light-4x.png": "5c56bf12d8ac62c544cb8d6cb6b3c599",
"version.json": "75037137719a0ded518f0b83141584b4"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
