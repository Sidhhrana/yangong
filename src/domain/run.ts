/**
 * SandboxRun 的 passed / total / failedCaseIds 必须从 TestCaseResult 推导。
 * 禁止手写一个聚合数字再另写一份明细。
 *
 * 这不是 SandboxRunner（#3）。Runner 负责执行；这里只对账。
 */

export type ReconcilableResult = {
  caseId: string;
  outcome: "pass" | "fail" | "skip";
};

export function reconcile(results: ReconcilableResult[], total = results.length) {
  if (!Number.isInteger(total) || total < 0) {
    throw new Error("reconcile: total must be a non-negative integer");
  }
  const failedCaseIds = [
    ...new Set(results.filter((r) => r.outcome === "fail").map((r) => r.caseId)),
  ];
  const skipped = new Set(results.filter((r) => r.outcome === "skip").map((r) => r.caseId));
  const passed = total - failedCaseIds.length - skipped.size;
  if (passed < 0) {
    throw new Error("reconcile: fails + skips exceed total");
  }
  return { passed, total, failedCaseIds };
}
