import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyState, loadDemo, makeLook, personalityResult, profileResult, replaceGarment, sampleState, saveDemo, travelList } from '../lib/demo';

test('first launch seeds only sample garments and templates', async () => {
  const state = await loadDemo();
  assert.equal(state.garments.length, 3);
  assert.equal(state.templates.length, 2);
  assert.equal(state.looks.length, 0);
  assert.ok(state.garments.every(item => item.sample));
});

test('local state survives a second read and empty reset is not reseeded', async () => {
  const blank = emptyState();
  await saveDemo(blank);
  const again = await loadDemo();
  assert.deepEqual(again, blank);
  assert.equal(again.garments.length, 0);
});

test('stored examples adopt the new artwork without changing personal uploads', async () => {
  const state = sampleState();
  state.garments[0].image = '/demo/garment-knit.png';
  state.garments.push({ id: 'mine', name: '我的衣服', category: '上衣', color: '蓝', season: '四季', occasion: '日常', image: 'data:image/webp;base64,test' });
  await saveDemo(state);
  const next = await loadDemo();
  assert.equal(next.garments[0].image, '/demo/garment-knit-v2.png');
  assert.equal(next.garments.at(-1)?.image, 'data:image/webp;base64,test');
});

test('six answers produce a result from actual choices', () => {
  assert.equal(profileResult([0, 0, 1, 0, 2, 3]).name, '清冷利落');
  assert.equal(profileResult([1, 1, 1, 2, 3, 1]).name, '柔和浪漫');
  assert.equal(personalityResult([2, 2, 0]), '松弛自然');
  assert.equal(personalityResult([2, 0, 1]), '松弛自然');
});

test('stylist uses current clothes and changed inputs alter the outcome', () => {
  const state = sampleState();
  const calm = makeLook(state, '上班', '20℃', '清冷');
  const relaxed = makeLook(state, '出游', '27℃', '松弛');
  assert.equal(calm.garmentIds.length, 3);
  assert.equal(relaxed.garmentIds.length, 2);
  assert.notEqual(calm.hair, relaxed.hair);
  assert.notEqual(calm.note, relaxed.note);
  assert.equal(relaxed.temperature, '27℃');
});

test('replacement picks another garment of the same category', () => {
  const state = sampleState();
  state.garments.push({ id: 'other-knit', name: '另一件上衣', category: '上衣', color: '蓝', season: '夏季', occasion: '日常', image: '' });
  const look = makeLook(state, '上班', '20℃', '温柔');
  const next = replaceGarment(look, state, 'sample-knit');
  assert.ok(next.garmentIds.includes('other-knit'));
  assert.ok(!next.garmentIds.includes('sample-knit'));
  assert.equal(replaceGarment(next, state, 'sample-jacket'), next);
});

test('travel list contains only owned garment names', () => {
  const state = sampleState();
  const list = travelList(state, 5, '出游');
  assert.ok(list.length > 0);
  assert.ok(list.every(name => state.garments.some(item => item.name === name)));
});
