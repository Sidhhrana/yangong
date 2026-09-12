/** 默认分账。合同可以覆盖。三项比例之和必须为 1。 */
export const DEFAULT_SPLIT = { base: 2 / 3, quality: 1 / 6, upstream: 1 / 6 } as const;

export type AwardSplit = {
  base: number;
  quality: number;
  upstream: number;
};

/** Award 必须从合同奖池出账。三项之和等于 pool，禁止写死金额。 */
export function splitAward(pool: number, split: AwardSplit = DEFAULT_SPLIT) {
  if (!Number.isFinite(pool) || pool < 0) {
    throw new Error("splitAward: pool must be a non-negative number");
  }
  if (split.base < 0 || split.quality < 0 || split.upstream < 0) {
    throw new Error("splitAward: split ratios must be non-negative");
  }
  const ratioSum = split.base + split.quality + split.upstream;
  if (Math.abs(ratioSum - 1) > 1e-9) {
    throw new Error("splitAward: split ratios must sum to 1");
  }
  const whole = Math.round(pool);
  const base = Math.round(whole * split.base);
  const qualityBonus = Math.round(whole * split.quality);
  const upstreamBonus = whole - base - qualityBonus;
  if (base < 0 || qualityBonus < 0 || upstreamBonus < 0) {
    throw new Error("splitAward: rounded parts must be non-negative");
  }
  return { base, qualityBonus, upstreamBonus, total: whole };
}
