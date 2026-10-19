import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('public/journey-ui.js', 'utf8');

function tabDom() {
  const tabs = ['theory', 'video', 'exercises'].map(name => ({
    dataset: {lessonTab: name}, attributes: {}, tabIndex: name === 'theory' ? 0 : -1,
    classList: {names: new Set(), toggle(name, active) { active ? this.names.add(name) : this.names.delete(name); }},
    focus() { this.focused = true; },
    closest(selector) { return selector === '[data-lesson-tab]' ? this : null; },
    setAttribute(name, value) { this.attributes[name] = value; },
  }));
  const panels = ['theory', 'video', 'exercises'].map(name => ({
    dataset: {lessonPanel: name}, id: `lesson-panel-${name}`, hidden: name !== 'theory',
    attributes: {}, scrollTop: 0,
    setAttribute(name, value) { this.attributes[name] = value; },
  }));
  const document = {
    querySelectorAll(selector) {
      if (selector === '[data-lesson-tab]') return tabs;
      if (selector === '[data-lesson-panel]') return panels;
      return [];
    },
    querySelector(selector) {
      const panel = selector.match(/^#lesson-panel-(theory|video|exercises)$/);
      if (panel) return panels.find(item => item.dataset.lessonPanel === panel[1]) ?? null;
      const tab = selector.match(/^\[data-lesson-tab="(theory|video|exercises)"\]$/);
      if (tab) return tabs.find(item => item.dataset.lessonTab === tab[1]) ?? null;
      return null;
    },
  };
  return {document, tabs, panels};
}

function tabHelpers(document, suspendContentVideo = () => {}) {
  const start = source.indexOf('function setLessonTab');
  const end = source.indexOf('function renderLessonTabs');
  assert.ok(start >= 0 && end > start, 'journey-ui exposes the tab helpers');
  const helperSource = source.slice(start, end);
  return new Function('$', 'document', 'contentVideo', `
    let activeLesson = 'lesson-1', lessonTab = 'theory', lessonTabScroll = {};
    ${helperSource}
    return {setLessonTab, handleKeyDown, state: () => ({lessonTab, lessonTabScroll})};
  `)(selector => document.querySelector(selector), document, {suspendContentVideo});
}

test('abas atualizam estado ARIA, foco, painel visível e preservam rolagem própria', () => {
  const {document, tabs, panels} = tabDom();
  let suspended = 0;
  const helpers = tabHelpers(document, () => { suspended += 1; });

  helpers.setLessonTab('video');
  assert.equal(tabs[1].attributes['aria-selected'], 'true');
  assert.equal(tabs[1].tabIndex, 0);
  assert.equal(panels[1].hidden, false);
  assert.equal(panels[0].hidden, true);
  panels[1].scrollTop = 73;
  helpers.setLessonTab('exercises');
  assert.equal(suspended, 1);
  assert.equal(panels[1].hidden, true);
  panels[2].scrollTop = 21;
  helpers.setLessonTab('video');
  assert.equal(panels[1].scrollTop, 73);
  assert.equal(panels[2].hidden, true);

  let prevented = false;
  helpers.handleKeyDown({target: tabs[1], key: 'ArrowRight', preventDefault: () => { prevented = true; }});
  assert.equal(prevented, true);
  assert.equal(tabs[2].focused, true);
  assert.equal(helpers.state().lessonTab, 'exercises');
  helpers.handleKeyDown({target: tabs[2], key: 'Home', preventDefault() {}});
  assert.equal(tabs[0].focused, true);
  assert.equal(helpers.state().lessonTab, 'theory');
});

test('trocar aba não chama exercício, touch ou estudo e o template não volta a âncoras', () => {
  const clickStart = source.indexOf('const tab=event.target.closest', source.indexOf('async function handleClick'));
  const clickEnd = source.indexOf('const button=event.target.closest', clickStart);
  const tabBranch = source.slice(clickStart, clickEnd);
  assert.doesNotMatch(tabBranch, /config\.(exercise|touch|study)/);
  const openStart = source.indexOf('async function openLesson');
  const openEnd = source.indexOf('async function handleClick', openStart);
  const openBody = source.slice(openStart, openEnd);
  assert.match(openBody, /renderLessonTabs\(/);
  assert.match(openBody, /await config\.touch\(id,l\.contentVersion\)/);
  assert.doesNotMatch(openBody, /return renderLessonTabs\(/);
  assert.doesNotMatch(openBody, /scrollIntoView/);
  assert.equal((source.match(/role="tablist"/g) ?? []).length, 1);
  assert.equal((source.match(/data-lesson-panel=/g) ?? []).length, 3);
});

test('trocar entre abas conserva a identidade do exercício e sua seleção/correção', () => {
  const {document} = tabDom();
  const helpers = tabHelpers(document);
  const exercise = {selected: 'B', feedback: 'correta'};
  const panel = document.querySelector('#lesson-panel-exercises');
  panel.exercise = exercise;
  helpers.setLessonTab('exercises');
  helpers.setLessonTab('theory');
  helpers.setLessonTab('exercises');
  assert.strictEqual(panel.exercise, exercise);
  assert.deepEqual(panel.exercise, {selected: 'B', feedback: 'correta'});
});

test('sair da aba de vídeo remove o iframe ativo e mantém a videoaula selecionada', async () => {
  const oldDocument = globalThis.document;
  const oldFetch = globalThis.fetch;
  const poster = {listeners: {}, addEventListener(name, callback) { this.listeners[name] = callback; }};
  const player = {html: '', set innerHTML(value) { this.html = value; }, get innerHTML() { return this.html; }};
  const root = {
    isConnected: true, dataset: {contentId: 'lesson-1'}, html: '',
    set innerHTML(value) { this.html = value; if (!value.includes('<iframe')) player.html = ''; }, get innerHTML() { return this.html; },
    querySelector(selector) {
      if (selector === '.lesson-poster') return poster;
      if (selector === '.lesson-player') return player;
      if (selector === 'iframe') return player.html.includes('<iframe') ? {} : null;
      return null;
    },
    closest() { return null; },
  };
  globalThis.document = {visibilityState: 'visible', querySelector: selector => selector === '#learning-content-video' ? root : null};
  globalThis.fetch = async () => new Response(JSON.stringify({videos: [{id: 'video-1', title: 'Aula teste', channel: 'Canal', thumbnail: 'https://img.test/1.jpg', url: 'https://youtu.be/video-1'}]}), {status: 200});
  try {
    const videos = await import(`../public/videos.js?lesson-tabs=${Date.now()}`);
    await videos.loadContentVideo('lesson-1');
    poster.listeners.click();
    player.html = '<iframe></iframe>';
    assert.ok(root.querySelector('iframe'));
    videos.suspendContentVideo(root);
    assert.equal(root.querySelector('iframe'), null);
    assert.equal(root.dataset.contentId, 'lesson-1');
  } finally {
    globalThis.document = oldDocument;
    globalThis.fetch = oldFetch;
  }
});
