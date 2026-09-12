import assert from "node:assert/strict";
import { test } from "node:test";
import { splitAward } from "./award.ts";

test("voice demo pool 3000 still splits to 2000 + 500 + 500", () => {
  const a = splitAward(3000);
  assert.deepEqual(a, { base: 2000, qualityBonus: 500, upstreamBonus: 500, total: 3000 });
});

test("award total always equals pool", () => {
  for (const pool of [1000, 1800, 3500, 5200]) {
    const a = splitAward(pool);
    assert.equal(a.base + a.qualityBonus + a.upstreamBonus, pool);
    assert.equal(a.total, pool);
  }
});
