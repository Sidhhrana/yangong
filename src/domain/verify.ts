/** 手工验收：合同 required 没有记录就不能提交。沙箱未列出的仍按 reconcile 视为通过。 */
export function missingRequired(
  required: { id: string }[],
  rows: { caseId: string }[],
): string[] {
  return required.filter((c) => !rows.some((r) => r.caseId === c.id)).map((c) => c.id);
}

export function failedRequiredCodes(
  required: { id: string; code: string }[],
  rows: { caseId: string; outcome: string }[],
): string[] {
  return required
    .filter((c) => rows.some((r) => r.caseId === c.id && r.outcome === "fail"))
    .map((c) => c.code);
}

export function canCommitVerification(
  kind: "sandbox_test" | "rubric" | "runtime_stability" | string,
  required: { id: string }[],
  rows: { caseId: string }[],
): boolean {
  if (kind === "sandbox_test") return rows.length > 0;
  return missingRequired(required, rows).length === 0 && required.length > 0;
}