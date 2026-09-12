# ADR 0002 · 结算只认支付宝订单号

## 状态

已接受。对应规划 V0.3「人工结算凭证上传」。

## 决定

`Settlement.paid` 必须挂一份支付宝凭证：16–32 位数字订单号。

没有订单号，不能从 pending 走到 paid。合 PR、CI 绿、Owner 口头「付了」都不算。

## 拒绝

- `0x…` 链上钱包
- 微信 / Stripe / PayPal / 国际电汇
- 空字符串、演示占位 `alipay://manual/yangong-demo`

Winner ≠ Paid 在这里落地：Award 存在只说明该给谁多少钱；Settlement.proof 才是钱走了。
