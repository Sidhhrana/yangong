import type { Attempt, StabilityEvidence } from "./types.ts";

export function canFinalAccept(
  attempt: Pick<Attempt, "id" | "status">,
  evidence: Pick<StabilityEvidence, "attemptId" | "outcome"> | undefined,
) {
  if (attempt.status !== "stability") return false;
  return evidence?.attemptId === attempt.id && evidence.outcome === "pass";
}
