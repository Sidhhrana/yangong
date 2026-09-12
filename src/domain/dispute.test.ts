import assert from "node:assert/strict";
import { test } from "node:test";
import { assertNotDisputed, canOpenDispute, canResolveDispute } from "./dispute.ts";

test("judging / accepted / settling 可以打开争议", () => {
  assert.equal(canOpenDispute({ status: "judging" }), true);
  assert.equal(canOpenDispute({ status: "accepted" }), true);
  assert.equal(canOpenDispute({ status: "settling" }), true);
});

test("closed / open 不能打开争议", () => {
  assert.equal(canOpenDispute({ status: "closed" }), false);
  assert.equal(canOpenDispute({ status: "open" }), false);
});

test("争议只能回到 judging / cancelled / rejected", () => {
  const open = { status: "open" as const };
  assert.equal(canResolveDispute(open, "judging"), true);
  assert.equal(canResolveDispute(open, "closed"), false);
  assert.equal(canResolveDispute({ status: "resolved" }, "judging"), false);
});

test("争议中禁止打款", () => {
  assert.throws(() => assertNotDisputed({ status: "disputed" }));
  assert.doesNotThrow(() => assertNotDisputed({ status: "settling" }));
});
