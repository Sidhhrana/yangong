/**
 * Verification Infrastructure - SandboxRunner and Verification Contracts.
 *
 * Reuses canonical domain types from ./types.ts.
 */

import type {
  Submission,
  SandboxSpec,
  SandboxRun,
  TestCaseResult,
  Verification,
  VerificationOutcome,
} from "./types.ts";

export interface SandboxExecutionOutput {
  run: SandboxRun;
  results: TestCaseResult[];
}

/**
 * Contract for any sandbox runner implementation.
 * Receives a submission, the versioned sandbox specification, and target suite IDs.
 * Produces a SandboxRun trace and detailed TestCaseResult items.
 */
export interface SandboxRunner {
  run(
    submission: Submission,
    spec: SandboxSpec,
    suiteIds: string[]
  ): Promise<SandboxExecutionOutput>;
}

/**
 * Validates that secrets in a SandboxSpec contain names only, never secret values.
 * Fails fast if secret values or assignments (e.g. KEY=val) are detected.
 */
export function assertSecretNamesOnly(spec: SandboxSpec): void {
  if (!spec.secretNames) return;
  for (const name of spec.secretNames) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new Error(`Invalid secret name in spec: ${String(name)}`);
    }
    if (name.includes("=") || name.includes(":") || name.includes("Bearer") || name.length > 100) {
      throw new Error(
        `Security violation: secretNames must only contain identifier names, never values. Detected: '${name}'`
      );
    }
  }
}

/**
 * Evaluates whether a SandboxRun meets acceptance criteria, producing a Verification record.
 *
 * Contract semantics:
 * - TestCase passing counts solely reflect unit/regression test outcomes.
 * - Benchmark SLA criteria (e.g. P95 < 800ms) are evaluated at the Verification level.
 *   If P95 threshold is breached, the overall Verification outcome is 'fail' even if
 *   all 50 test cases passed (e.g. Carol scenario: 50/50 passed, but Verification FAIL).
 */
export function verifySandboxRun(
  run: SandboxRun,
  results: TestCaseResult[],
  criteria: { maxP95Ms?: number; requiredCaseIds?: string[] } = {}
): Verification {
  const reasons: string[] = [];
  let outcome: VerificationOutcome = "pass";

  // 1. Check unit test cases
  if (run.failedCaseIds.length > 0 || run.passed < run.total) {
    outcome = "fail";
    reasons.push(
      `Test suite failed: ${run.total - run.passed}/${run.total} cases failed [${run.failedCaseIds.join(", ")}]`
    );
  }

  // 2. Check required specific test cases if specified
  if (criteria.requiredCaseIds) {
    for (const reqId of criteria.requiredCaseIds) {
      const res = results.find((r) => r.caseId === reqId);
      if (!res || res.outcome !== "pass") {
        outcome = "fail";
        reasons.push(`Required case ${reqId} did not pass`);
      }
    }
  }

  // 3. Check Benchmark SLA threshold (contractual rule: P95 < maxP95Ms)
  const maxP95 = criteria.maxP95Ms ?? 800;
  if (run.p95Ms !== undefined && run.p95Ms > maxP95) {
    outcome = "fail";
    reasons.push(
      `P95 latency SLA breached: actual ${run.p95Ms}ms exceeds contract threshold ${maxP95}ms`
    );
  }

  return {
    id: `ver-${run.id}`,
    taskId: run.taskId,
    attemptId: run.attemptId,
    submissionId: run.submissionId,
    runId: run.id,
    outcome,
    reason: reasons.length > 0 ? reasons.join("; ") : "All test cases passed and latency SLA met",
  };
}
