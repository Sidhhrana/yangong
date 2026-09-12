# ADR 0003 · 身份在连接器，不在合同

## 状态

已接受。来源：Issue #3 第一次真实认领。有人贴了 `0x` 钱包，有人写对了 `claiming slot`，有人没占席直接开 PR。

## 决定

1. 领域里的人是 `Person.id`。GitHub handle、支付宝账号都不写进 Task / Attempt / Award。
2. GitHub handle 只证明「谁在仓库里说话」。支付宝账号只证明「钱打给谁」。两根轨。
3. 认领是 `Claim` 对象，不是 GitHub 评论。口令是 `claiming slot`。贴链上钱包 = 拒绝，先到也不占席。
4. exclusive 只有一个 `accepted` Claim。后来的有效口令进 `waitlist`。没有口令的 PR 不是 Winner。
5. 收款账号在 merge 之后私信。Issue/PR 里的钱包、订单号、手机号都不当绑定成功。

## 拒绝

- `Person.githubUserId` / `Award.alipayAccount` 进领域内核
- 把 GitHub 登录当成已经能打款
- 把 `0x…` 当认领或当支付宝

Winner ≠ Paid 在身份上也成立：占席 ≠ 收款账号已绑定。
