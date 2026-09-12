import assert from "node:assert/strict";
import { test } from "node:test";
import { InMemoryVoiceRunner, VOICE_CASE_TOTAL, voiceRunner } from "./in-memory-voice.ts";
import { assertGoAttempt, canGoTask } from "./machine.ts";
import { reconcile } from "./run.ts";
import { assertSecretNamesOnly, isSandboxRunner, type SandboxRunner } from "./sandbox.ts";
import type { SandboxSpec, Submission } from "./types.ts";

const spec: SandboxSpec = {
  id: "spec-voice",
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
  summary: "三人同一镜像。",
};

const suiteIds = ["suite-reliability", "suite-streaming", "suite-voice"];

function sub(id: string, attemptId: string): Pick<Submission, "id" | "taskId" | "attemptId"> {
  return { id, taskId: "t-voice", attemptId };
}

function runWith(runner: SandboxRunner, id: string, attemptId: string) {
  return runner.run({
    submission: sub(id, attemptId),
    spec,
    suiteIds,
    catalogTotal: VOICE_CASE_TOTAL,
    now: "2026-09-10T15:00:00+08:00",
  });
}

test("调用方只依赖接口，不依赖 InMemoryVoiceRunner 类名", () => {
  assert.equal(isSandboxRunner(voiceRunner), true);
  const runner: SandboxRunner = voiceRunner;
  assert.equal(runner.key, "voice-runtime-v3.2");
  assert.equal(runner.accepts(spec), true);
  assert.equal(runner.accepts({ ...spec, key: "rubric-runner-v1" }), false);
});

test("Alice：017 卡死，004 也进聚合。库存 19，不是 48/50", () => {
  const { run, results } = runWith(voiceRunner, "sub-a", "att-a");
  const row = results.find((r) => r.caseId === "tc-voice-17");
  assert.ok(row);
  assert.equal(row.outcome, "fail");
  assert.equal(row.expected, "Wi-Fi 断开 3s 后 TTS 在 3s 内重连");
  assert.equal(row.actual, "TTS 永久卡死");
  assert.equal(row.failureReason, "重连路径没有监听 network online");
  assert.deepEqual(reconcile(results, VOICE_CASE_TOTAL), {
    passed: run.passed,
    total: run.total,
    failedCaseIds: run.failedCaseIds,
  });
  assert.equal(run.total, 19);
  assert.equal(run.passed, 16);
  assert.ok(run.failedCaseIds.includes("tc-voice-17"));
  assert.ok(run.failedCaseIds.includes("tc-voice-04"));
  assert.ok(run.failedCaseIds.includes("tc-voice-31"));
  assert.equal(run.specId, spec.id);
  assert.equal(run.image, spec.image);
  assert.deepEqual(run.suiteIds, suiteIds);
  assert.equal("taskStatus" in run, false);
});

test("Bob：017 在 1.1s 重连通过。失败在噪声 / barge-in / jitter / 重试", () => {
  const { run, results } = runWith(voiceRunner, "sub-b", "att-b");
  const row = results.find((r) => r.caseId === "tc-voice-17");
  assert.ok(row);
  assert.equal(row.outcome, "pass");
  assert.equal(row.actual, "1.1s 重连");
  assert.equal(run.failedCaseIds.includes("tc-voice-17"), false);
  assert.ok(run.failedCaseIds.includes("tc-voice-05"));
  assert.ok(run.failedCaseIds.includes("tc-voice-31"));
  assert.ok(run.failedCaseIds.includes("tc-net-04"));
  assert.ok(run.failedCaseIds.includes("tc-rel-04"));
  assert.equal(run.total, 19);
  assert.equal(run.passed, 15);
});

test("Carol：004 是用例失败，不是 50/50 全绿再在 Verification 旁路判 P95", () => {
  const { run, results } = runWith(voiceRunner, "sub-c", "att-c");
  const row = results.find((r) => r.caseId === "tc-voice-04");
  assert.ok(row);
  assert.equal(row.outcome, "fail");
  assert.equal(row.expected, "P95 < 800ms");
  assert.equal(row.actual, "1300ms");
  assert.equal(row.failureReason, "测试全绿但尾延迟超阈值。相对好看不够。");
  assert.deepEqual(run.failedCaseIds, ["tc-voice-04"]);
  assert.equal(run.total, 19);
  assert.equal(run.passed, 18);
  assert.equal(run.p95Ms, 1300);
  assert.notEqual(run.passed, run.total);
});

test("接整份 SandboxSpec；密钥只有名", () => {
  assert.doesNotThrow(() => assertSecretNamesOnly(spec));
  assert.throws(() => assertSecretNamesOnly({ ...spec, secretNames: ["DEEPSEEK_API_KEY=sk-live"] }));
  assert.throws(() => assertSecretNamesOnly({ ...spec, secretNames: ["0xabc"] }));
  const runner = new InMemoryVoiceRunner();
  assert.throws(() =>
    runner.run({
      submission: sub("sub-a", "att-a"),
      spec: { ...spec, key: "field-airgap-v1" },
      suiteIds,
    }),
  );
  assert.throws(() =>
    runner.run({
      submission: sub("sub-unknown", "att-x"),
      spec,
      suiteIds,
    }),
  );
});

test("Runner 不改状态机。verifying → failed 合法，Task 仍可以停在 judging", () => {
  assert.equal(assertGoAttempt("verifying", "failed"), "failed");
  assert.equal(assertGoAttempt("verifying", "passed"), "passed");
  assert.equal(canGoTask("judging", "accepted"), true);
  assert.equal(canGoTask("judging", "closed"), false);
});
