import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CLAIM_PHRASE,
  classifyClaimText,
  decideExclusiveClaim,
  exclusiveWinner,
} from "./claim.ts";

test("口令才是认领", () => {
  assert.equal(classifyClaimText("claiming slot"), "claim");
  assert.equal(classifyClaimText("Claiming Slot\n我披露 AI 辅助"), "claim");
  assert.equal(CLAIM_PHRASE, "claiming slot");
});

test("贴 0x 钱包不是认领，先到也不占席", () => {
  const kind = classifyClaimText("Payout Wallet: 0x52513A733D4b52282F2b4f5A91D965D38b64f3BB");
  assert.equal(kind, "crypto");
  assert.equal(decideExclusiveClaim(kind, false), "rejected");
});

test("没有口令的长方案 / 直接 PR 不是认领", () => {
  assert.equal(classifyClaimText("Fixes #3 Proposed Fix SandboxRunner"), "noise");
  assert.equal(decideExclusiveClaim("noise", false), "rejected");
});

test("exclusive：第一个有效口令占席，后来的进候补", () => {
  assert.equal(decideExclusiveClaim("claim", false), "accepted");
  assert.equal(decideExclusiveClaim("claim", true), "waitlist");
});

test("crypto 被拒之后，口令者仍可成为 Winner", () => {
  const claims = [
    { kind: "crypto" as const, status: "rejected" as const, createdAt: "2026-09-12T09:21:00Z" },
    { kind: "claim" as const, status: "accepted" as const, createdAt: "2026-09-12T09:30:00Z" },
    { kind: "claim" as const, status: "waitlist" as const, createdAt: "2026-09-12T10:10:00Z" },
  ];
  const winner = exclusiveWinner(claims);
  assert.equal(winner?.createdAt, "2026-09-12T09:30:00Z");
});
