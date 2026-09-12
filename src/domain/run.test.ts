import assert from "node:assert/strict";
import { test } from "node:test";
import { reconcile } from "./run.ts";

test("聚合由明细推导", () => {
  const agg = reconcile([
    { caseId: "a", outcome: "pass" },
    { caseId: "b", outcome: "fail" },
    { caseId: "c", outcome: "fail" },
  ]);
  assert.deepEqual(agg, { passed: 1, total: 3, failedCaseIds: ["b", "c"] });
});

test("未列出的用例视为通过，total 来自库存", () => {
  const agg = reconcile([{ caseId: "b", outcome: "fail" }], 18);
  assert.equal(agg.passed, 17);
  assert.equal(agg.total, 18);
  assert.deepEqual(agg.failedCaseIds, ["b"]);
});

test("失败加跳过不能超过 total", () => {
  assert.throws(() =>
    reconcile(
      [
        { caseId: "a", outcome: "fail" },
        { caseId: "b", outcome: "fail" },
      ],
      1,
    ),
  );
});
