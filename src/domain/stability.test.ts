import assert from "node:assert/strict";
import { test } from "node:test";
import { canFinalAccept } from "./stability.ts";

test("没有稳定期证据不能 accepted", () => {
  assert.equal(canFinalAccept({ id: "a", status: "stability" }, undefined), false);
});

test("证据 FAIL 不能 accepted", () => {
  assert.equal(
    canFinalAccept({ id: "a", status: "stability" }, { attemptId: "a", outcome: "fail" }),
    false,
  );
});

test("证据 PASS 且 Attempt 在 stability 才能 accepted", () => {
  assert.equal(
    canFinalAccept({ id: "a", status: "stability" }, { attemptId: "a", outcome: "pass" }),
    true,
  );
  assert.equal(
    canFinalAccept({ id: "a", status: "passed" }, { attemptId: "a", outcome: "pass" }),
    false,
  );
});
