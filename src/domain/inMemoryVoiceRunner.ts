/**
 * In-memory voice sandbox runner implementation.
 *
 * Encapsulates deterministic test execution scripts for Alice (sub-a),
 * Bob (sub-b), and Carol (sub-c) without external container dependencies.
 */

import type {
  Submission,
  SandboxSpec,
  SandboxRun,
  TestCaseResult,
} from "./types.ts";
import type {
  SandboxRunner,
  SandboxExecutionOutput,
} from "./sandbox.ts";
import {
  assertSecretNamesOnly,
} from "./sandbox.ts";
import { VOICE_RUN_SCRIPT, VOICE_CASE_SCRIPT } from "../data/seed.ts";

export class InMemoryVoiceRunner implements SandboxRunner {
  async run(
    submission: Submission,
    spec: SandboxSpec,
    suiteIds: string[]
  ): Promise<SandboxExecutionOutput> {
    // 1. Validate spec and enforce security constraints
    if (!spec || !spec.id || !spec.key) {
      throw new Error("SandboxSpec must have valid id and key.");
    }
    if (!suiteIds || suiteIds.length === 0) {
      throw new Error("suiteIds must not be empty.");
    }
    assertSecretNamesOnly(spec);

    // 2. Lookup pre-configured script for the submission
    const script = VOICE_RUN_SCRIPT[submission.id];
    if (!script) {
      throw new Error(
        `Unknown submission id '${submission.id}'. Expected one of: ${Object.keys(
          VOICE_RUN_SCRIPT
        ).join(", ")}`
      );
    }

    const runId = `run-${submission.id}-${Date.now()}`;

    // 3. Construct SandboxRun trace linking spec and suiteIds
    const run: SandboxRun = {
      id: runId,
      taskId: submission.taskId,
      attemptId: submission.attemptId,
      submissionId: submission.id,
      specId: spec.id,
      suiteIds: [...suiteIds],
      image: spec.image,
      status: "completed",
      passed: script.passed,
      total: script.total,
      p50Ms: script.p50Ms,
      p95Ms: script.p95Ms,
      interruptPct: script.interruptPct,
      memoryMb: script.memoryMb,
      failedCaseIds: [...script.failedCaseIds],
      artifacts: [`${spec.key}-metrics.json`, "run.log"],
      startedAt: new Date(Date.now() - 30000).toISOString(),
      finishedAt: new Date().toISOString(),
    };

    // 4. Map detailed TestCaseResult items with expected / actual / failureReason
    const caseTemplates = VOICE_CASE_SCRIPT[submission.id] || [];
    const results: TestCaseResult[] = caseTemplates.map((template, index) => ({
      id: `tcr-${submission.id}-${index + 1}`,
      runId: run.id,
      caseId: template.caseId,
      attemptId: submission.attemptId,
      outcome: template.outcome,
      expected: template.expected,
      actual: template.actual,
      durationMs: template.durationMs,
      failureReason: template.failureReason,
      artifacts: template.artifacts ? [...template.artifacts] : [],
    }));

    return { run, results };
  }
}
