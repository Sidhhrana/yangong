export const CLAIM_PHRASE = "claiming slot";

export type ClaimKind = "claim" | "crypto" | "noise";
export type ClaimStatus = "pending" | "accepted" | "waitlist" | "rejected";

export interface ClaimInput {
  text: string;
  alreadyAccepted: boolean;
}

/**
 * GitHub 评论不是认领对象。认领是领域动作。
 * 贴 0x 钱包永远不是认领。
 */
export function classifyClaimText(raw: string): ClaimKind {
  const text = raw.trim();
  if (!text) return "noise";
  if (/0x[0-9a-fA-F]{20,}/.test(text)) return "crypto";
  if (/^T[1-9A-HJ-NP-Za-km-z]{20,}$/m.test(text)) return "crypto";
  if (text.toLowerCase().includes(CLAIM_PHRASE)) return "claim";
  return "noise";
}

export function decideExclusiveClaim(kind: ClaimKind, alreadyAccepted: boolean): ClaimStatus {
  if (kind === "crypto" || kind === "noise") return "rejected";
  if (alreadyAccepted) return "waitlist";
  return "accepted";
}

export function exclusiveWinner<T extends { kind: ClaimKind; status: ClaimStatus; createdAt: string }>(
  claims: T[],
): T | undefined {
  return claims
    .filter((c) => c.kind === "claim" && c.status === "accepted")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
}
