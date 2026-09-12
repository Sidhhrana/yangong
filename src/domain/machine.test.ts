import assert from "node:assert/strict";
import { test } from "node:test";
import { createSeed } from "../data/seed.ts";
import {
  assertGoAttempt,
  assertGoTask,
  canGoTask,
  checkTaskAttemptConsistency,
} from "./machine.ts";
import type { Attempt, Task } from "./types.ts";

test("Task cannot jump judging → closed", () => {
  assert.throws(() => assertGoTask("judging", "closed"));
});

test("Task cannot jump accepted → closed (must settle)", () => {
  assert.throws(() => assertGoTask("accepted", "closed"));
});

test("Task judging → accepted is allowed", () => {
  assert.equal(assertGoTask("judging", "accepted"), "accepted");
});

test("Attempt cannot jump provisional → accepted", () => {
  assert.throws(() => assertGoAttempt("provisional", "accepted"));
});

test("Attempt verifying → failed is allowed", () => {
  assert.equal(assertGoAttempt("verifying", "failed"), "failed");
});

test("Attempt passed → stability is allowed", () => {
  assert.equal(assertGoAttempt("passed", "stability"), "stability");
});

test("Task cannot reopen from closed", () => {
  assert.equal(canGoTask("closed", "open"), false);
});

test("seed 里每一份 Task 都通过跨机器不变量", () => {
  const s = createSeed();
  for (const task of s.tasks) {
    const r = checkTaskAttemptConsistency(task, s.attempts, {
      slots: s.slots,
      settlements: s.settlements,
    });
    assert.equal(r.ok, true, `${task.id}: ${r.violations.join("; ")}`);
  }
});

test("有人在写或在测时 Task 不能是 closed", () => {
  const task = { id: "t", status: "closed" } as Task;
  const attempts = [{ id: "a", taskId: "t", status: "working" } as Attempt];
  const r = checkTaskAttemptConsistency(task, attempts);
  assert.equal(r.ok, false);
});

test("Task accepted 必须恰好一个 Attempt accepted", () => {
  const task = { id: "t", status: "accepted" } as Task;
  const none = checkTaskAttemptConsistency(task, []);
  assert.equal(none.ok, false);
  const two = checkTaskAttemptConsistency(task, [
    { id: "a", taskId: "t", status: "accepted" } as Attempt,
    { id: "b", taskId: "t", status: "accepted" } as Attempt,
  ]);
  assert.equal(two.ok, false);
});

test("同一 Slot 可以有一次 live + 多次 failed", () => {
  const task = { id: "t", status: "judging" } as Task;
  const r = checkTaskAttemptConsistency(
    task,
    [
      { id: "a1", taskId: "t", slotId: "s", status: "failed" } as Attempt,
      { id: "a2", taskId: "t", slotId: "s", status: "working", previousAttemptId: "a1" } as Attempt,
    ],
    { slots: [{ id: "s", taskId: "t", index: 1, status: "filled" }] },
  );
  assert.equal(r.ok, true, r.violations.join("; "));
});

test("两个 live Attempt 占同一 Slot 非法", () => {
  const task = { id: "t", status: "active" } as Task;
  const r = checkTaskAttemptConsistency(
    task,
    [
      { id: "a1", taskId: "t", slotId: "s", status: "working" } as Attempt,
      { id: "a2", taskId: "t", slotId: "s", status: "working" } as Attempt,
    ],
    { slots: [{ id: "s", taskId: "t", index: 1, status: "filled" }] },
  );
  assert.equal(r.ok, false);
});

test("disputed 不能带 paid Settlement，必须有 Dispute 对象", () => {
  const task = { id: "t", status: "disputed" } as Task;
  const noObj = checkTaskAttemptConsistency(task, []);
  assert.equal(noObj.ok, false);
  const paid = checkTaskAttemptConsistency(task, [], {
    settlements: [{ id: "st", awardId: "aw", method: "alipay", currency: "CNY", status: "paid", amount: 1 }],
    disputes: [{ id: "d", taskId: "t", openedBy: "p", reason: "x", evidenceIds: ["sub"], status: "open", openedAt: "t" }],
  });
  assert.equal(paid.ok, false);
});

test("expired 不能有 live Attempt", () => {
  const task = { id: "t", status: "expired" } as Task;
  const r = checkTaskAttemptConsistency(task, [{ id: "a", taskId: "t", status: "working" } as Attempt]);
  assert.equal(r.ok, false);
});

test("applied 席位不能有 Attempt", () => {
  const task = { id: "t", status: "open" } as Task;
  const r = checkTaskAttemptConsistency(
    task,
    [{ id: "a", taskId: "t", slotId: "s", status: "working" } as Attempt],
    { slots: [{ id: "s", taskId: "t", index: 1, status: "applied" }] },
  );
  assert.equal(r.ok, false);
});

