import assert from "node:assert/strict";
import { test } from "node:test";
import { shouldExpire } from "./expire.ts";
import type { Task } from "./types.ts";

const now = "2026-09-21T00:00:00+08:00";

test("open 超过 deadline 应过期", () => {
  const task = { status: "open", deadline: "2026-09-20T16:00:00+08:00" } as Task;
  assert.equal(shouldExpire(task, now), true);
});

test("active 超过 deadline 应过期", () => {
  const task = { status: "active", deadline: "2026-09-20T16:00:00+08:00" } as Task;
  assert.equal(shouldExpire(task, now), true);
});

test("settling 不因超过原 deadline 自动过期", () => {
  const task = { status: "settling", deadline: "2026-09-20T16:00:00+08:00" } as Task;
  assert.equal(shouldExpire(task, now), false);
});

test("accepted / closed / judging 都不走 expired", () => {
  for (const status of ["accepted", "closed", "judging", "disputed"] as const) {
    const task = { status, deadline: "2026-01-01T00:00:00+08:00" } as Task;
    assert.equal(shouldExpire(task, now), false, status);
  }
});

test("open 但未到截止日不过期", () => {
  const task = { status: "open", deadline: "2026-09-25T12:00:00+08:00" } as Task;
  assert.equal(shouldExpire(task, now), false);
});
