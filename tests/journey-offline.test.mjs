import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../dist/server/index.js';

test('instalação serve a trilha completa, os índices e o acervo anterior com a rede desligada', async () => {
  const listeners = {}, storage = new Map();
  const cacheKey = input => new URL(typeof input === 'string' ? input : input.url, 'https://app.test').href;
  const cache = {
    addAll: async paths => {
      for (const path of paths) {
        const response = await worker.fetch(new Request(new URL(path, 'https://app.test')), {}, {});
        assert.equal(response.ok, true, `Recurso de instalação indisponível: ${path}`);
        storage.set(cacheKey(path), response);
      }
    },
    match: async key => storage.get(cacheKey(key))?.clone(),
  };
  const caches = { open: async () => cache, match: key => cache.match(key), keys: async () => [], delete: async () => true };
  const self = {
    location: { origin: 'https://app.test' },
    addEventListener: (name, handler) => { listeners[name] = handler; },
    skipWaiting: async () => {}, clients: { claim: async () => {} },
  };
  vm.runInNewContext(fs.readFileSync('public/sw.js', 'utf8'), {
    self, caches, URL, Response, fetch: async () => { throw new Error('offline'); },
  });
  let installed;
  listeners.install({ waitUntil: value => { installed = value; } });
  await installed;
  const assets = {};
  for (const path of ['/learning-path.json', '/learning-path-index.json', '/roadmap.json', '/roadmap-index.json', '/study-bank.json', '/bank.json']) {
    let result;
    listeners.fetch({ request: new Request('https://app.test' + path), respondWith: value => { result = value; } });
    const response = await result;
    assert.equal(response.status, 200, `Arquivo não disponível offline: ${path}`);
    assets[path] = await response.json();
  }
  assert.equal(assets['/learning-path.json'].schemaVersion, 2);
  assert.equal(assets['/learning-path.json'].modules.length, 25);
  assert.equal(assets['/learning-path.json'].modules.flatMap(module => module.lessons).length, 199);
  assert.equal(assets['/learning-path.json'].stages.length, 3);
  assert.equal(assets['/roadmap.json'].modules.flatMap(module => module.lessons).length, 98);
  assert.equal(assets['/study-bank.json'].length, 392);
});
