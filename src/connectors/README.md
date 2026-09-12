# Connectors

这一层可替换。不要把 GitHub 或支付宝写进 `src/domain/machine.ts`。

- `github.ts` Issue URL → 合同草稿；PR URL → Submission.kind
- `alipay.ts` 只有合法订单号才能把 Settlement 标 paid

见 `docs/adr/0001-github-connector.md` 和 `docs/adr/0002-alipay-settlement.md`。
