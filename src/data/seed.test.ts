import assert from "node:assert/strict";
import { test } from "node:test";
import { reconcile } from "../domain/run.ts";
import {
  REVIEW_CASE_SCRIPT,
  REVIEW_RUN_SCRIPT,
  VOICE_CASE_SCRIPT,
  VOICE_CASE_TOTAL,
  VOICE_RUN_SCRIPT,
  createSeed,
} from "./seed.ts";

test("语音库存总数等于合同套件 caseCount 之和", () => {
  const s = createSeed();
  const contract = s.contracts.find((c) => c.taskId === "t-voice");
  const total = s.suites
    .filter((x) => contract?.suiteIds.includes(x.id))
    .reduce((n, x) => n + x.caseCount, 0);
  assert.equal(total, VOICE_CASE_TOTAL);
  assert.equal(total, 19);
});

test("每个语音 SandboxRun 聚合等于 reconcile(明细)", () => {
  for (const [id, rows] of Object.entries(VOICE_CASE_SCRIPT)) {
    assert.deepEqual(
      {
        passed: VOICE_RUN_SCRIPT[id].passed,
        total: VOICE_RUN_SCRIPT[id].total,
        failedCaseIds: VOICE_RUN_SCRIPT[id].failedCaseIds,
      },
      reconcile(rows, VOICE_CASE_TOTAL),
      id,
    );
  }
});

test("Alice 明细失败含 017，聚合不再丢 004", () => {
  assert.ok(VOICE_RUN_SCRIPT["sub-a"].failedCaseIds.includes("tc-voice-17"));
  assert.ok(VOICE_RUN_SCRIPT["sub-a"].failedCaseIds.includes("tc-voice-04"));
  assert.equal(VOICE_RUN_SCRIPT["sub-a"].total, VOICE_CASE_TOTAL);
  assert.equal(VOICE_RUN_SCRIPT["sub-a"].passed, VOICE_CASE_TOTAL - 3);
});

test("Carol 不再假装 50/50：004 失败写进聚合", () => {
  assert.deepEqual(VOICE_RUN_SCRIPT["sub-c"].failedCaseIds, ["tc-voice-04"]);
  assert.equal(VOICE_RUN_SCRIPT["sub-c"].passed, VOICE_CASE_TOTAL - 1);
  assert.equal(VOICE_RUN_SCRIPT["sub-c"].total, VOICE_CASE_TOTAL);
});

test("评审脚本也对账", () => {
  for (const [id, rows] of Object.entries(REVIEW_CASE_SCRIPT)) {
    const agg = reconcile(rows);
    assert.equal(REVIEW_RUN_SCRIPT[id].passed, agg.passed);
    assert.equal(REVIEW_RUN_SCRIPT[id].total, agg.total);
    assert.deepEqual(REVIEW_RUN_SCRIPT[id].failedCaseIds, agg.failedCaseIds);
  }
});

test("design / video / article 套件各有 3 条 required，且描述含 FAIL 反例", () => {
  const s = createSeed();
  for (const id of ["suite-design", "suite-video", "suite-article"]) {
    const rows = s.cases.filter((c) => c.suiteId === id);
    assert.equal(rows.length, 3, id);
    assert.ok(rows.every((c) => c.required), id);
    assert.ok(rows.every((c) => /FAIL/.test(c.description)), id);
    assert.ok(rows.every((c) => Boolean(c.originNote)), id);
    const suite = s.suites.find((x) => x.id === id);
    assert.equal(suite?.caseCount, rows.length, id);
  }
});

