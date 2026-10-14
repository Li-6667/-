import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://127.0.0.1:3000');

async function read(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} should return HTTP 200`);
  assert.equal(new URL(response.url).pathname, path, `${path} should not redirect to another version`);
  return response.text();
}

const home = await read('/');
assert.match(home, /今天穿什么？/, 'The default home must be the rebuilt product');
assert.match(home, /穿成你喜欢的样子。/, 'The rebuilt home headline must be present');
assert.match(home, /girls-retro-v2/, 'The rebuilt home must display the new illustrated characters');
assert.match(home, /href="\/legacy"/, 'The home must retain its legacy comparison link');

const legacy = await read('/legacy');
assert.notEqual(legacy, home, 'Legacy must remain a separate page');
assert.doesNotMatch(legacy, /girls-retro-v2/, 'The legacy page must not serve the rebuilt home');

const guide = await read('/upgrade');
assert.match(guide, /也把方法留给你/, 'The guide must remain independently accessible');
console.log(`PASS ${base.origin}: / = rebuilt home; /legacy = original; /upgrade = guide`);
