import assert from "node:assert/strict";
import { test } from "node:test";
import { canCommitVerification, failedRequiredCodes, missingRequired } from "./verify.ts";

const required = [
  { id: "tc-rev-01", code: "TC-REV-001" },
  { id: "tc-rev-04", code: "TC-REV-004" },
];

test("量表缺一条 required 不能提交", () => {
  const rows = [{ caseId: "tc-rev-01", outcome: "pass" }];
  assert.deepEqual(missingRequired(required, rows), ["tc-rev-04"]);
  assert.equal(canCommitVerification("rubric", required, rows), false);
});

test("失败码来自记录，不是来自 submission id", () => {
  const rows = [
    { caseId: "tc-rev-01", outcome: "pass" },
    { caseId: "tc-rev-04", outcome: "fail" },
  ];
  assert.deepEqual(failedRequiredCodes(required, rows), ["TC-REV-004"]);
  assert.equal(canCommitVerification("rubric", required, rows), true);
});

test("沙箱有明细就能提交，未列出的 required 不挡", () => {
  assert.equal(canCommitVerification("sandbox_test", required, [{ caseId: "tc-voice-17" }]), true);
  assert.equal(canCommitVerification("sandbox_test", required, []), false);
});
