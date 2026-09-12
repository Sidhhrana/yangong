/** Award 必须从合同奖池出账。三项之和等于 pool，禁止写死金额。 */
export function splitAward(pool: number) {
  const base = Math.round(pool * (2 / 3));
  const qualityBonus = Math.round(pool / 6);
  const upstreamBonus = pool - base - qualityBonus;
  return { base, qualityBonus, upstreamBonus, total: pool };
}
