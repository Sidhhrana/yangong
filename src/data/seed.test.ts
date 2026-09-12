import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyClaimText, exclusiveWinner } from "../domain/claim.ts";
import { nextProvisionalId } from "../domain/evaluate.ts";
import { reconcile } from "../domain/run.ts";
import {
  ATT_B,
  REVIEW_CASE_SCRIPT,
  REVIEW_RUN_SCRIPT,
  RUNNER_TASK,
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

test("语音竞赛是已发生的记录：Alice 第 1 名失败，递补是 Bob", () => {
  const s = createSeed();
  const evals = s.evaluations.filter((e) => e.taskId === "t-voice");
  assert.equal(evals.length, 3);
  assert.equal(evals.find((e) => e.attemptId === "att-a")?.rank, 1);
  assert.equal(s.runs.filter((r) => r.taskId === "t-voice").length, 3);
  assert.ok(s.caseResults.some((r) => r.caseId === "tc-voice-17" && r.outcome === "fail"));
  const mine = s.attempts.filter((a) => a.taskId === "t-voice");
  assert.equal(nextProvisionalId(evals, mine), ATT_B);
  assert.equal(mine.find((a) => a.id === ATT_B)?.status, "passed");
});

test("相对评审套件：第 1 名可 FAIL、不能跳号、门槛、同分", () => {
  const s = createSeed();
  const rows = s.cases.filter((c) => c.suiteId === "suite-eval");
  assert.equal(rows.length, 4);
  assert.ok(rows.every((c) => c.required && /FAIL/.test(c.description)));
  assert.equal(s.suites.find((x) => x.id === "suite-eval")?.caseCount, 4);
});

test("对账套件：重复、冲突、P95 写在用例上", () => {
  const s = createSeed();
  const rows = s.cases.filter((c) => c.suiteId === "suite-run");
  assert.equal(rows.length, 3);
  assert.ok(rows.every((c) => c.required && /FAIL/.test(c.description)));
  assert.equal(s.suites.find((x) => x.id === "suite-run")?.caseCount, 3);
});

test("认领事故进了验证库，且 seed Claim 符合 exclusive 规则", () => {
  const s = createSeed();
  const rows = s.cases.filter((c) => c.suiteId === "suite-claim");
  assert.equal(rows.length, 5);
  assert.ok(rows.every((c) => c.required && /FAIL/.test(c.description)));
  const mine = s.claims.filter((c) => c.taskId === RUNNER_TASK);
  assert.equal(classifyClaimText(mine.find((c) => c.id === "cl-hope")!.text), "crypto");
  assert.equal(exclusiveWinner(mine)?.personId, "p-kou");
  assert.equal(mine.find((c) => c.personId === "p-zbz")?.status, "waitlist");
  assert.equal(mine.find((c) => c.personId === "p-sid")?.status, "rejected");
});
