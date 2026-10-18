import test from 'node:test';
import assert from 'node:assert/strict';

test('ponte de atualização confirma estado, rejeita ack ausente e conserva estado em erro', async () => {
  const old = { window: globalThis.window, document: globalThis.document, AndroidNetwork: globalThis.AndroidNetwork, MutationObserver: globalThis.MutationObserver, location: globalThis.location };
  let auto = false, mode = 'ok';
  const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: {'Content-Type':'application/json'} });
  globalThis.location = { origin: 'https://appassets.androidplatform.net' };
  globalThis.document = { documentElement: { dataset: {} }, readyState: 'loading', addEventListener() {} };
  globalThis.MutationObserver = class { observe() {} };
  globalThis.window = { fetch: async input => { const path = new URL(input, globalThis.location.origin).pathname; return response(path === '/bank.json' || path === '/study-bank.json' ? [] : path === '/video-catalog.json' ? [] : path === '/curriculum.json' || path === '/roadmap.json' ? {modules: []} : {}); } };
  globalThis.AndroidNetwork = { postMessage(raw) { const message = JSON.parse(raw); queueMicrotask(() => { const result = message.kind === 'config' ? {id: message.id, versionName: '1.0.0', systemDark: false, autoUpdateEnabled: auto} : mode === 'error' ? {id: message.id, error: 'falha nativa'} : mode === 'missing' ? {id: message.id} : (message.kind === 'set-auto-updates' ? (auto = message.enabled, {id: message.id, autoUpdateEnabled: auto, saved: true}) : {id: message.id}); this.onmessage?.({data: JSON.stringify(result)}); }); } };
  try {
    await import(`../android/app/src/main/assets/android-runtime.js?runtime-test=${Date.now()}`);
    assert.equal(window.EquacaoAndroid.autoUpdateEnabled, false);
    assert.equal(await window.EquacaoAndroid.setAutoUpdates(true), true);
    assert.equal(window.EquacaoAndroid.autoUpdateEnabled, true);
    assert.equal(await window.EquacaoAndroid.setAutoUpdates(false), false);
    mode = 'missing';
    await assert.rejects(window.EquacaoAndroid.setAutoUpdates(true), /não confirmou/);
    assert.equal(window.EquacaoAndroid.autoUpdateEnabled, false);
    mode = 'error';
    await assert.rejects(window.EquacaoAndroid.setAutoUpdates(true), /falha nativa/);
    assert.equal(window.EquacaoAndroid.autoUpdateEnabled, false);
  } finally { for (const [key, value] of Object.entries(old)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } }
});
