/**
 * 语音沙箱的内存实现。夹具在这里，不在 seed，也不在 store。
 * 聚合必须走 reconcile。P95 是 TC-VOICE-004，不是 Verification 旁路。
 * 库存是 19，不是 issue 原文里的 50。
 */

import { reconcile } from "./run.ts";
import { judgeBound } from "./bound.ts";
import { assertSecretNamesOnly, type SandboxExecution, type SandboxJob, type SandboxRunner } from "./sandbox.ts";
import type { SandboxSpec, TestCaseResult } from "./types.ts";

export const VOICE_SPEC_KEY = "voice-runtime-v3.2";
export const VOICE_CASE_TOTAL = 19;

export const VOICE_CASE_SCRIPT: Record<
  string,
  Omit<TestCaseResult, "id" | "runId" | "attemptId">[]
> = {
  "sub-a": [
    { caseId: "tc-voice-04", outcome: "fail", expected: "P95 < 800ms", actual: "920ms", durationMs: 48000, failureReason: "回合级尾延迟超合同阈值", artifacts: ["metrics.json"] },
    { caseId: "tc-voice-17", outcome: "fail", expected: "Wi-Fi 断开 3s 后 TTS 在 3s 内重连", actual: "TTS 永久卡死", durationMs: 14000, failureReason: "重连路径没有监听 network online", artifacts: ["logs", "audio", "wifi-blip-3s.pcap"] },
    { caseId: "tc-voice-31", outcome: "fail", expected: "连续两次 barge-in 保持会话", actual: "第二次打断后 session = null", durationMs: 860, failureReason: "共享缓冲被第一次打断释放", artifacts: ["trace"] },
  ],
  "sub-b": [
    { caseId: "tc-voice-04", outcome: "pass", expected: "P95 < 800ms", actual: "710ms", durationMs: 48000, artifacts: ["metrics.json"] },
    { caseId: "tc-voice-17", outcome: "pass", expected: "Wi-Fi 断开 3s 后 TTS 在 3s 内重连", actual: "1.1s 重连", durationMs: 4100, artifacts: ["logs"] },
    { caseId: "tc-voice-05", outcome: "fail", expected: "SNR 10dB 意图可解析", actual: "意图置信 0.31", durationMs: 1200, failureReason: "噪声模型未启用", artifacts: ["audio"] },
    { caseId: "tc-voice-31", outcome: "fail", expected: "连续两次 barge-in 保持会话", actual: "第二次打断丢 1 个 user turn", durationMs: 640, artifacts: ["trace"] },
    { caseId: "tc-net-04", outcome: "fail", expected: "200ms jitter 不崩溃", actual: "jitter 缓冲溢出", durationMs: 2200, artifacts: ["logs"] },
    { caseId: "tc-rel-04", outcome: "fail", expected: "瞬时失败最多重试 3 次", actual: "无限重试", durationMs: 9000, artifacts: ["logs"] },
  ],
  "sub-c": [
    { caseId: "tc-voice-04", outcome: "fail", expected: "P95 < 800ms", actual: "1300ms", durationMs: 48000, failureReason: "测试全绿但尾延迟超阈值。相对好看不够。", artifacts: ["metrics.json"] },
    { caseId: "tc-voice-17", outcome: "pass", expected: "Wi-Fi 断开 3s 后 TTS 在 3s 内重连", actual: "0.8s 重连", durationMs: 3800, artifacts: ["logs"] },
  ],
};

function applyBounds(
  rows: Omit<TestCaseResult, "id" | "runId" | "attemptId">[],
): Omit<TestCaseResult, "id" | "runId" | "attemptId">[] {
  return rows.map((row) => {
    const judged = judgeBound(row.expected, row.actual);
    return judged ? { ...row, outcome: judged } : row;
  });
}

const VOICE_METRICS: Record<string, { p50Ms: number; p95Ms: number; interruptPct: number; memoryMb: number }> = {
  "sub-a": { p50Ms: 610, p95Ms: 920, interruptPct: 98, memoryMb: 620 },
  "sub-b": { p50Ms: 480, p95Ms: 710, interruptPct: 91, memoryMb: 410 },
  "sub-c": { p50Ms: 820, p95Ms: 1300, interruptPct: 99, memoryMb: 390 },
};

export const VOICE_RUN_SCRIPT: Record<
  string,
  {
    passed: number;
    total: number;
    p50Ms: number;
    p95Ms: number;
    interruptPct: number;
    memoryMb: number;
    failedCaseIds: string[];
  }
> = Object.fromEntries(
  Object.entries(VOICE_CASE_SCRIPT).map(([id, rows]) => [
    id,
    { ...VOICE_METRICS[id], ...reconcile(applyBounds(rows), VOICE_CASE_TOTAL) },
  ]),
);

export class InMemoryVoiceRunner implements SandboxRunner {
  readonly key = VOICE_SPEC_KEY;

  accepts(spec: SandboxSpec): boolean {
    return spec.key === this.key;
  }

  run(job: SandboxJob): SandboxExecution {
    assertSecretNamesOnly(job.spec);
    if (!this.accepts(job.spec)) {
      throw new Error(`InMemoryVoiceRunner 只接 ${this.key}，收到 ${job.spec.key}`);
    }
    if (job.suiteIds.length === 0) {
      throw new Error("suiteIds 不能空");
    }
    const raw = VOICE_CASE_SCRIPT[job.submission.id];
    if (!raw) {
      throw new Error(`没有夹具 ${job.submission.id}`);
    }
    const rows = applyBounds(raw);
    const catalogTotal = job.catalogTotal ?? VOICE_CASE_TOTAL;
    const agg = reconcile(rows, catalogTotal);
    const metrics = VOICE_METRICS[job.submission.id];
    const now = job.now ?? new Date().toISOString();
    return {
      run: {
        taskId: job.submission.taskId,
        attemptId: job.submission.attemptId,
        submissionId: job.submission.id,
        specId: job.spec.id,
        suiteIds: [...job.suiteIds],
        image: job.spec.image,
        status: "completed",
        passed: agg.passed,
        total: agg.total,
        failedCaseIds: agg.failedCaseIds,
        p50Ms: metrics.p50Ms,
        p95Ms: metrics.p95Ms,
        interruptPct: metrics.interruptPct,
        memoryMb: metrics.memoryMb,
        artifacts: ["logs", "audio", "trace", "metrics"],
        startedAt: now,
        finishedAt: now,
      },
      results: rows.map((row) => ({
        ...row,
        attemptId: job.submission.attemptId,
        artifacts: [...row.artifacts],
      })),
    };
  }
}

export const voiceRunner: SandboxRunner = new InMemoryVoiceRunner();
