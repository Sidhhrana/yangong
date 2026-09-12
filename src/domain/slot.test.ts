import assert from "node:assert/strict";
import { test } from "node:test";
import { canApprove, canCreateAttempt, slotStatusOnClaim } from "./slot.ts";

test("approval_required 申领得到 applied", () => {
  assert.equal(slotStatusOnClaim("approval_required"), "applied");
  assert.equal(canCreateAttempt({ status: "applied" }), false);
  assert.equal(canApprove({ status: "applied" }), true);
});

test("permissionless 申领直接 filled，可以建 Attempt", () => {
  assert.equal(slotStatusOnClaim("permissionless"), "filled");
  assert.equal(canCreateAttempt({ status: "filled" }), true);
});
