/**
 * SandboxRun 的 passed / total / failedCaseIds 必须从 TestCaseResult 推导。
 * 禁止手写一个聚合数字再另写一份明细。
 *
 * 这不是 SandboxRunner。Runner 负责执行；这里只对账。
 *
 * - 同一 caseId 同结论算一次
 * - 同一 caseId 冲突结论拒绝
 * - 没给库存时 total = 唯一 caseId 数
 * - 给了库存时，未列出的视为通过
 */

export type ReconcilableResult = {
  caseId: string;
  outcome: "pass" | "fail" | "skip";
};

export function reconcile(results: ReconcilableResult[], total?: number) {
  const byId = new Map<string, ReconcilableResult["outcome"]>();
  for (const row of results) {
    const prev = byId.get(row.caseId);
    if (prev && prev !== row.outcome) {
      throw new Error(`reconcile: case ${row.caseId} 结论冲突（${prev} vs ${row.outcome}）`);
    }
    byId.set(row.caseId, row.outcome);
  }
  const unique = [...byId.entries()];
  const catalog = total ?? unique.length;
  if (!Number.isInteger(catalog) || catalog < 0) {
    throw new Error("reconcile: total must be a non-negative integer");
  }
  if (unique.length > catalog) {
    throw new Error("reconcile: unique cases exceed total");
  }
  const failedCaseIds = unique.filter(([, outcome]) => outcome === "fail").map(([id]) => id);
  const skipped = unique.filter(([, outcome]) => outcome === "skip").length;
  const passed = catalog - failedCaseIds.length - skipped;
  if (passed < 0) {
    throw new Error("reconcile: fails + skips exceed total");
  }
  return { passed, total: catalog, failedCaseIds };
}
