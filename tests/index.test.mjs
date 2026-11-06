import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('phase expansion', () => {
  const p = api.expandIntervals(
    [
      { label: 'work', durationSeconds: 30 },
      { label: 'rest', durationSeconds: 15 },
    ],
    2,
  );
  assert.equal(p.length, 4);
  assert.equal(p[2].startSeconds, 45);
  assert.equal(p[3].endSeconds, 90);
});
test('half-open boundaries', () => {
  const p = api.expandIntervals([{ label: 'a', durationSeconds: 10 }], 2);
  assert.equal(api.locateInterval(p, 0), 0);
  assert.equal(api.locateInterval(p, 10), 1);
  assert.equal(api.locateInterval(p, 20), null);
});
test('input ownership', () => {
  const a = { label: 'a', durationSeconds: 10 },
    p = api.expandIntervals([a]);
  a.durationSeconds = 99;
  assert.equal(p[0].endSeconds, 10);
});
test('output budget', () => {
  assert.throws(() =>
    api.expandIntervals(
      Array.from({ length: 1000 }, () => ({ label: 'a', durationSeconds: 1 })),
      11,
    ),
  );
});
test('invalid phase and plan', () => {
  assert.throws(() => api.expandIntervals([{ label: '', durationSeconds: 1 }]));
  assert.throws(() => api.expandIntervals([{ label: 'a', durationSeconds: 0 }]));
  assert.throws(() => api.locateInterval([{ index: 0, startSeconds: 1, endSeconds: 2 }], 1));
});
test('prefix sum oracle', () => {
  const durations = [1, 3, 7, 2, 5],
    p = api.expandIntervals(
      durations.map((d, i) => ({ label: String(i), durationSeconds: d })),
      10,
    );
  let sum = 0;
  for (let i = 0; i < p.length; i++) {
    assert.equal(p[i].startSeconds, sum);
    sum += durations[i % 5];
    assert.equal(p[i].endSeconds, sum);
  }
});
