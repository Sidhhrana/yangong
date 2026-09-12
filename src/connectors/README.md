# Connectors

这一层可替换。不要把 GitHub 或支付宝写进 `src/domain/machine.ts`。

- `github.ts` Issue URL → 合同草稿；PR URL → Submission.kind
- `alipay.ts` 只有合法订单号才能把 Settlement 标 paid
- `identity.ts` GitHub handle 与支付宝账号。钱包两者都不是

见 `docs/adr/0001-github-connector.md`、`docs/adr/0002-alipay-settlement.md`、`docs/adr/0003-identity-rails.md`。
