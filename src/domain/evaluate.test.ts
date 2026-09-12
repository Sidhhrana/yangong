import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SCORE_FLOOR,
  assignRanks,
  canNominateProvisional,
  dimensionsFor,
  nextProvisionalId,
  qualifyByScore,
  scoreFromDimensions,
} from "./evaluate.ts";

const alice = { id: "att-a", score: 91, submittedAt: "2026-09-09T21:10:00+08:00" };
const bob = { id: "att-b", score: 86, submittedAt: "2026-09-10T01:40:00+08:00" };
const carol = { id: "att-c", score: 73, submittedAt: "2026-09-10T08:05:00+08:00" };

test("分数决定名次，Alice 91 是第 1，不是数组下标", () => {
  const ranks = Object.fromEntries(assignRanks([carol, bob, alice]).map((r) => [r.id, r.rank]));
  assert.equal(ranks["att-a"], 1);
  assert.equal(ranks["att-b"], 2);
  assert.equal(ranks["att-c"], 3);
});

test("同分先提交者排名靠前", () => {
  const ranks = assignRanks([
    { id: "late", score: 80, submittedAt: "2026-09-10T12:00:00Z" },
    { id: "early", score: 80, submittedAt: "2026-09-10T08:00:00Z" },
  ]);
  assert.deepEqual(ranks.map((r) => r.id), ["early", "late"]);
});

test("低于门槛取消资格，不占名次", () => {
  assert.equal(qualifyByScore(SCORE_FLOOR - 1), "disqualified");
  assert.equal(qualifyByScore(SCORE_FLOOR), "qualified");
  const ranks = assignRanks([
    alice,
    { id: "att-x", score: 40, submittedAt: "2026-09-08T00:00:00Z" },
  ]);
  assert.equal(ranks.find((r) => r.id === "att-x")?.rank, 0);
  assert.equal(ranks.find((r) => r.id === "att-a")?.rank, 1);
});

test("不能跳过仍合格的第 2 名去拟中标第 3 名", () => {
  const evals = [
    { attemptId: "att-a", rank: 1 },
    { attemptId: "att-b", rank: 2 },
    { attemptId: "att-c", rank: 3 },
  ];
  const atts = [
    { id: "att-a", status: "failed" as const },
    { id: "att-b", status: "qualified" as const },
    { id: "att-c", status: "passed" as const },
  ];
  assert.equal(nextProvisionalId(evals, atts), "att-b");
  assert.equal(canNominateProvisional("att-c", evals, atts), false);
  assert.equal(canNominateProvisional("att-b", evals, atts), true);
});

test("第 1 名绝对验收失败，不等于能改排名", () => {
  const evals = [
    { attemptId: "att-a", rank: 1 },
    { attemptId: "att-b", rank: 2 },
  ];
  const atts = [
    { id: "att-a", status: "failed" as const },
    { id: "att-b", status: "qualified" as const },
  ];
  assert.equal(evals[0].rank, 1);
  assert.equal(nextProvisionalId(evals, atts), "att-b");
});

test("已有拟中标在测时不能另提名", () => {
  const evals = [
    { attemptId: "att-a", rank: 1 },
    { attemptId: "att-b", rank: 2 },
  ];
  const atts = [
    { id: "att-a", status: "verifying" as const },
    { id: "att-b", status: "qualified" as const },
  ];
  assert.equal(nextProvisionalId(evals, atts), undefined);
});

test("总分从维度算，不查 submission id", () => {
  assert.equal(
    scoreFromDimensions([
      { score: 94 },
      { score: 93 },
      { score: 78 },
      { score: 90 },
    ]),
    89,
  );
  assert.deepEqual(dimensionsFor("review"), ["引用", "覆盖", "矛盾", "来源"]);
});
