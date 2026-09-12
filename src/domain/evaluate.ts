import type { Attempt, AttemptStatus, Evaluation, TaskType } from "./types.ts";

/** 低于此分取消资格。相对好看不够，门槛都没过。 */
export const SCORE_FLOOR = 60;

const BLOCKING: AttemptStatus[] = ["provisional", "verifying", "stability"];

export function qualifyByScore(score: number): "qualified" | "disqualified" {
  return score >= SCORE_FLOOR ? "qualified" : "disqualified";
}

export type RankInput = { id: string; score: number; submittedAt: string };

/** 分数高者靠前。同分看谁先提交。未过门槛不占名次（rank = 0）。 */
export function assignRanks(rows: RankInput[]): { id: string; rank: number }[] {
  const eligible = rows.filter((r) => r.score >= SCORE_FLOOR);
  const sorted = [...eligible].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.submittedAt.localeCompare(b.submittedAt);
  });
  const ranked = sorted.map((r, i) => ({ id: r.id, rank: i + 1 }));
  const rest = rows
    .filter((r) => r.score < SCORE_FLOOR)
    .map((r) => ({ id: r.id, rank: 0 }));
  return [...ranked, ...rest];
}

/** 拟中标必须是仍合格候选人里名次最好的。不能跳号。 */
export function nextProvisionalId(
  evaluations: Pick<Evaluation, "attemptId" | "rank">[],
  attempts: Pick<Attempt, "id" | "status">[],
): string | undefined {
  if (attempts.some((a) => BLOCKING.includes(a.status))) return undefined;
  const byId = new Map(attempts.map((a) => [a.id, a]));
  const eligible = evaluations
    .filter((e) => {
      if (e.rank < 1) return false;
      const att = byId.get(e.attemptId);
      return att?.status === "qualified" || att?.status === "passed";
    })
    .sort((a, b) => a.rank - b.rank);
  return eligible[0]?.attemptId;
}

export function canNominateProvisional(
  attemptId: string,
  evaluations: Pick<Evaluation, "attemptId" | "rank">[],
  attempts: Pick<Attempt, "id" | "status">[],
): boolean {
  return nextProvisionalId(evaluations, attempts) === attemptId;
}

export function scoreFromDimensions(dimensions: { score: number }[]): number {
  if (dimensions.length === 0) return 0;
  const sum = dimensions.reduce((n, d) => n + d.score, 0);
  return Math.round(sum / dimensions.length);
}

export function dimensionsFor(type: TaskType): string[] {
  if (type === "review" || type === "article" || type === "research") {
    return ["引用", "覆盖", "矛盾", "来源"];
  }
  if (type === "deployment") return ["可访问", "健康", "备份", "回滚"];
  if (type === "design") return ["焦点", "对比度", "状态表"];
  if (type === "video") return ["路径", "口播", "时长"];
  return ["架构", "正确性", "延迟", "可维护"];
}
