// ClaimShield service worker — minimal app-shell cache for offline resilience.
// Bumped on each release; old caches are cleaned up on activate.
const CACHE = "claimshield-v1";
const APP_SHELL = [
  "/",
  "/cases",
  "/analysis/demo",
  "/legal",
  "/icon.svg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(APP_SHELL).catch(() => undefined)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API calls — they're per-request and may carry secrets.
  if (url.pathname.startsWith("/api/")) return;

  const accept = req.headers.get("accept") || "";

  // HTML navigations: network-first, fall back to cached copy, then to "/".
  if (req.mode === "navigate" || accept.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches
            .open(CACHE)
            .then((c) => c.put(req, copy))
            .catch(() => undefined);
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match("/")),
        ),
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res.ok && res.status === 200) {
              const copy = res.clone();
              caches
                .open(CACHE)
                .then((c) => c.put(req, copy))
                .catch(() => undefined);
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});
