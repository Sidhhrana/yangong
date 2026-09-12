# 两台状态机

源码：`src/domain/machine.ts`。改状态机先改这一份，再改 UI。

竞赛默认三席。候选人进度不写回 Task。

## Task · 市场相位

```
DRAFT → OPEN → ACTIVE → JUDGING → ACCEPTED → SETTLING → CLOSED
```

中文：草稿 → 公示 → 进行中 → 裁决中 → 已验收 → 待支付 → 已结算

旁路：`REJECTED` `CANCELLED` `DISPUTED` `EXPIRED`

| 状态 | 含义 |
| --- | --- |
| OPEN | 合同已公示，席位还在申领 |
| ACTIVE | 至少有一个 Attempt 在做。三人可以不同步 |
| JUDGING | 足够的 Submission 已齐，相对评审 / 沙箱 / 拟中标 / 稳定期都发生在这里 |
| ACCEPTED | 有 Attempt 通过稳定期。Winner ≠ Paid |
| SETTLING | Award 已出 |
| CLOSED | Settlement.paid |

**禁止** `judging → closed`。必须经过 `accepted → settling`。

## Attempt · 候选人进度

```
CLAIMED → WORKING → SUBMITTED → EVALUATING
  → QUALIFIED | DISQUALIFIED
  → PROVISIONAL → VERIFYING → PASSED | FAILED
  → STABILITY → ACCEPTED
```

旁路：`WITHDRAWN`

| 状态 | 含义 |
| --- | --- |
| PROVISIONAL / 拟中标 | 相对最优，尚未绝对合格 |
| VERIFYING | 按 TaskContract 引用的 SandboxSpec 跑 |
| PASSED | 绝对验收合格 |
| STABILITY | 稳定期。钱还不能付 |
| FAILED | 可被下一合格 Attempt 递补 |

同一 Task 下，A=verifying、B=working、C=failed 是合法的。Task 此时只能是 `active` 或 `judging`。

V0.1：一个 Slot 一个 Attempt。同一席位多次重试是后续合同。

## 参与模式

`exclusive` | `contest` | `cooperative`

`max_slots`: 1 | 3 | 10 | unlimited

默认任务：`contest + max_slots=3 + approval_required`。不要把 3 写死进领域模型。
