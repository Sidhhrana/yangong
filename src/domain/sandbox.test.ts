import assert from "node:assert/strict";
import { test } from "node:test";
import type { Submission, SandboxSpec } from "./types.ts";
import { assertGoAttempt, canGoTask } from "./machine.ts";
import { InMemoryVoiceRunner } from "./inMemoryVoiceRunner.ts";
import { verifySandboxRun, assertSecretNamesOnly } from "./sandbox.ts";
import { SPEC_VOICE, VOICE_TASK, VOICE_RUN_SCRIPT, VOICE_CASE_TOTAL } from "../data/seed.ts";

const voiceSpec: SandboxSpec = {
  id: SPEC_VOICE,
  key: "voice-runtime-v3.2",
  name: "实时语音运行时",
  version: "v3.2",
  image: "voice-runtime:v3.2",
  cpu: 4,
  memoryGb: 8,
  network: "restricted",
  timeout: "20m",
  runtime: { node: "24" },
  services: ["redis"],
  secretNames: ["DEEPSEEK_API_KEY"],
  fixtures: ["noisy-room.wav", "interrupt-test.wav", "wifi-blip-3s.pcap"],
  summary: "三人同一镜像、同一夹具、无外网。半年后有人说「我当时过了」，用 spec + suite + commit 回答。",
};

const suiteIds = ["voice/realtime-interruption-v1"];

function createSubmission(id: string, attemptId: string): Submission {
  return {
    id,
    taskId: VOICE_TASK,
    slotId: `slot-${id}`,
    attemptId,
    personId: `person-${id}`,
    kind: "pull_request",
    title: `Voice PR by ${id}`,
    url: `https://github.com/example/yangong/pull/${id}`,
    note: "submission",
    submittedAt: "2026-09-10T08:00:00Z",
  };
}

test("Alice (sub-a): TC-VOICE-017 & TC-VOICE-031 fail, Verification FAILS", async () => {
  const runner = new InMemoryVoiceRunner();
  const sub = createSubmission("sub-a", "att-a");
  const { run, results } = await runner.run(sub, voiceSpec, suiteIds);

  const script = VOICE_RUN_SCRIPT["sub-a"];
  assert.equal(run.total, VOICE_CASE_TOTAL);
  assert.equal(run.passed, script.passed);
  assert.deepEqual(run.failedCaseIds, script.failedCaseIds);
  assert.equal(run.specId, SPEC_VOICE);
  assert.deepEqual(run.suiteIds, suiteIds);

  // TestCaseResult expectations
  const tc017 = results.find((r) => r.caseId === "tc-voice-17");
  assert.ok(tc017, "tc-voice-17 result must exist");
  assert.equal(tc017.outcome, "fail");
  assert.equal(tc017.expected, "Wi-Fi 断开 3s 后 TTS 在 3s 内重连");
  assert.equal(tc017.actual, "TTS 永久卡死");
  assert.equal(tc017.failureReason, "重连路径没有监听 network online");

  const tc031 = results.find((r) => r.caseId === "tc-voice-31");
  assert.ok(tc031, "tc-voice-31 result must exist");
  assert.equal(tc031.outcome, "fail");

  // Top-level verification
  const verification = verifySandboxRun(run, results, { maxP95Ms: 800 });
  assert.equal(verification.outcome, "fail");
  assert.match(verification.reason, /Test suite failed/);
});

test("Bob (sub-b): TC-VOICE-017 PASSES (1.1s reconnect), Verification FAILS on other cases", async () => {
  const runner = new InMemoryVoiceRunner();
  const sub = createSubmission("sub-b", "att-b");
  const { run, results } = await runner.run(sub, voiceSpec, suiteIds);

  const script = VOICE_RUN_SCRIPT["sub-b"];
  assert.equal(run.total, VOICE_CASE_TOTAL);
  assert.equal(run.passed, script.passed);
  assert.equal(run.failedCaseIds.includes("tc-voice-17"), false);

  const tc017 = results.find((r) => r.caseId === "tc-voice-17");
  assert.ok(tc017, "tc-voice-17 result must exist");
  assert.equal(tc017.outcome, "pass");
  assert.equal(tc017.actual, "1.1s 重连");

  const verification = verifySandboxRun(run, results, { maxP95Ms: 800 });
  assert.equal(verification.outcome, "fail");
});

test("Carol (sub-c): unlisted test cases PASS, but Verification FAILS because P95 (1300ms) > 800ms", async () => {
  const runner = new InMemoryVoiceRunner();
  const sub = createSubmission("sub-c", "att-c");
  const { run, results } = await runner.run(sub, voiceSpec, suiteIds);

  const script = VOICE_RUN_SCRIPT["sub-c"];
  assert.equal(run.total, VOICE_CASE_TOTAL);
  assert.equal(run.passed, script.passed);
  assert.equal(run.p95Ms, 1300);

  // Benchmark test case result is recorded with details
  const tc004 = results.find((r) => r.caseId === "tc-voice-04");
  assert.ok(tc004, "tc-voice-04 result must exist");
  assert.equal(tc004.expected, "P95 < 800ms");
  assert.equal(tc004.actual, "1300ms");
  assert.equal(tc004.failureReason, "测试全绿但尾延迟超阈值。相对好看不够。");

  // Overall Verification fails due to contractual SLA threshold P95 < 800ms
  const verification = verifySandboxRun(run, results, { maxP95Ms: 800 });
  assert.equal(verification.outcome, "fail");
  assert.match(verification.reason, /P95 latency SLA breached: actual 1300ms/);
});

test("P95 严格不等式边界测试 (P95 < 800ms: 799ms PASS, 800ms FAIL, 801ms FAIL)", () => {
  const baseRun: SandboxRun = {
    id: "run-p95-boundary",
    taskId: "t-voice",
    attemptId: "att-p95",
    submissionId: "sub-p95",
    specId: "spec-voice",
    image: "voice-runtime:v3.2",
    status: "completed",
    passed: 19,
    total: 19,
    failedCaseIds: [],
    artifacts: ["metrics.json"],
    startedAt: "2026-09-12T12:00:00Z",
    finishedAt: "2026-09-12T12:05:00Z",
  };
  const dummyResults: TestCaseResult[] = [];

  // 1. 799ms -> PASS (满足严格 < 800ms)
  const ver799 = verifySandboxRun({ ...baseRun, p95Ms: 799 }, dummyResults, { maxP95Ms: 800 });
  assert.equal(ver799.outcome, "pass");

  // 2. 800ms -> FAIL (不满足严格 < 800ms)
  const ver800 = verifySandboxRun({ ...baseRun, p95Ms: 800 }, dummyResults, { maxP95Ms: 800 });
  assert.equal(ver800.outcome, "fail");
  assert.match(ver800.reason, /P95 latency SLA breached/);

  // 3. 801ms -> FAIL (不满足严格 < 800ms)
  const ver801 = verifySandboxRun({ ...baseRun, p95Ms: 801 }, dummyResults, { maxP95Ms: 800 });
  assert.equal(ver801.outcome, "fail");
  assert.match(ver801.reason, /P95 latency SLA breached/);
});

test("Security & Contract: secrets only contain names, never values", () => {
  assert.doesNotThrow(() => assertSecretNamesOnly(voiceSpec));

  const leakingSpec: SandboxSpec = {
    ...voiceSpec,
    secretNames: ["DEEPSEEK_API_KEY=sk-1234567890abcdef"],
  };
  assert.throws(() => assertSecretNamesOnly(leakingSpec), /Security violation/);
});

test("State Machine Invariant: Attempt transitions verifying -> failed while Task stays judging", () => {
  // Task remains judging
  assert.equal(canGoTask("judging", "accepted"), true);

  // Attempt can transition verifying -> failed
  assert.equal(assertGoAttempt("verifying", "failed"), "failed");
});
