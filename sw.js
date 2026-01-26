// UCIP PWA — NUKE SW (força sair de caches antigas)
// Objectivo: limpar tudo e auto-desregistar o SW antigo que te prende no v2.

self.addEventListener("install", (event) => {
  // instala imediatamente
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // 1) apagar todas as caches
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));

    // 2) tentar desregistar este service worker
    try { await self.registration.unregister(); } catch (e) {}

    // 3) forçar os clientes a recarregar com cache-bust
    const clientsArr = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsArr) {
      try {
        const url = new URL(client.url);
        url.searchParams.set("nocache", String(Date.now()));
        client.navigate(url.toString());
      } catch (e) {}
    }
  })());
});

// 4) NÃO interceptar fetch (deixa o browser ir à rede)
// Isto é intencional para quebrar o ciclo de caches.
self.addEventListener("fetch", () => {});
