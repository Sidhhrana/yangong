/**
 * SandboxRunner 是 Verification Infrastructure 的执行边界。
 * 不是 Connector。GitHub / 支付宝 / 身份才是 Connector。
 *
 * 吃 SandboxSpec + Submission + suiteIds。
 * 吐 SandboxRun + TestCaseResult[]。
 * 不改 Task，不写 Verification，不碰状态机。
 */

import type { SandboxRun, SandboxSpec, Submission, TestCaseResult } from "./types.ts";

export type SandboxJob = {
  submission: Pick<Submission, "id" | "taskId" | "attemptId">;
  spec: SandboxSpec;
  suiteIds: string[];
  catalogTotal?: number;
  now?: string;
};

export type SandboxExecution = {
  run: Omit<SandboxRun, "id">;
  results: Omit<TestCaseResult, "id" | "runId">[];
};

export interface SandboxRunner {
  readonly key: string;
  accepts(spec: SandboxSpec): boolean;
  run(job: SandboxJob): SandboxExecution;
}

const NAME = /^[A-Z][A-Z0-9_]{0,63}$/;

/** secretNames 只有名。带 = / sk- / 0x 直接扔。 */
export function assertSecretNamesOnly(spec: SandboxSpec): void {
  for (const name of spec.secretNames) {
    if (!NAME.test(name)) {
      throw new Error(`secretNames 只能是名字，不能是值：${name}`);
    }
  }
}

export function isSandboxRunner(value: unknown): value is SandboxRunner {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SandboxRunner).key === "string" &&
    typeof (value as SandboxRunner).accepts === "function" &&
    typeof (value as SandboxRunner).run === "function"
  );
}
