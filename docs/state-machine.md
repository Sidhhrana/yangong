# Task 状态机

源码：`src/domain/machine.ts`。改状态机先改这一份，再改 UI。

## 主线

```
DRAFT → OPEN → CLAIMING → IN_PROGRESS → SUBMITTED
  → EVALUATING → PROVISIONAL_ACCEPTED → VERIFYING
  → STABILITY_PERIOD → ACCEPTED → PAYMENT_PENDING → PAID
```

中文：草稿 → 公示 → 申领席位 → 进行中 → 已提交 → 评审中 → **拟中标** → 验证中 → 稳定期 → 已验收 → 待支付 → 已结算

## 旁路

`REJECTED` `CANCELLED` `DISPUTED` `EXPIRED`

## 关键语义

- **PROVISIONAL_ACCEPTED / 拟中标**：相对最优，尚未绝对合格。
- **VERIFYING**：同一沙箱、同一套件、同一镜像。
- **STABILITY_PERIOD**：Winner 已经产生，钱还不能付。
- 验证失败：回到 `EVALUATING`，选下一个绝对合格的候选人递补；没有则 `REJECTED`。

## 参与模式

`exclusive` | `contest` | `cooperative`

`max_slots`: 1 | 3 | 10 | unlimited

默认任务：`contest + max_slots=3 + approval_required`。不要把 3 写死进领域模型。
