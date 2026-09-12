import assert from "node:assert/strict";
import { test } from "node:test";
import { splitAward } from "./award.ts";

test("voice demo pool 3000 still splits to 2000 + 500 + 500", () => {
  const a = splitAward(3000);
  assert.deepEqual(a, { base: 2000, qualityBonus: 500, upstreamBonus: 500, total: 3000 });
});

test("award total always equals pool and parts are non-negative", () => {
  for (const pool of [0, 1, 2, 7, 1000, 1800, 3500, 5200]) {
    const a = splitAward(pool);
    assert.equal(a.base + a.qualityBonus + a.upstreamBonus, pool);
    assert.equal(a.total, pool);
    assert.ok(a.base >= 0 && a.qualityBonus >= 0 && a.upstreamBonus >= 0);
  }
});

test("contract can override split", () => {
  const a = splitAward(1000, { base: 0.5, quality: 0.3, upstream: 0.2 });
  assert.deepEqual(a, { base: 500, qualityBonus: 300, upstreamBonus: 200, total: 1000 });
});

test("split that does not sum to 1 is illegal", () => {
  assert.throws(() => splitAward(100, { base: 1, quality: 1, upstream: 0 }));
});
