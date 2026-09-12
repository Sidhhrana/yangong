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

test("重复同结论只算一次，默认 total 按唯一 caseId", () => {
  assert.deepEqual(
    reconcile([
      { caseId: "a", outcome: "fail" },
      { caseId: "a", outcome: "fail" },
    ]),
    { passed: 0, total: 1, failedCaseIds: ["a"] },
  );
});

test("同一 case 冲突结论拒绝", () => {
  assert.throws(() =>
    reconcile([
      { caseId: "a", outcome: "fail" },
      { caseId: "a", outcome: "skip" },
    ]),
  );
  assert.throws(() =>
    reconcile([
      { caseId: "a", outcome: "pass" },
      { caseId: "a", outcome: "fail" },
    ]),
  );
});

test("显式库存仍把未列出的当通过；重复失败不额外占名额", () => {
  const agg = reconcile(
    [
      { caseId: "a", outcome: "fail" },
      { caseId: "a", outcome: "fail" },
    ],
    2,
  );
  assert.equal(agg.passed, 1);
  assert.equal(agg.total, 2);
  assert.deepEqual(agg.failedCaseIds, ["a"]);
});

