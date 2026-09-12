# Domain kernel

这里是验工的第一公民。UI、支付、GitHub App 都不要污染这一层。

GitHub 和支付宝在 `src/connectors/`。改连接器不要改 `machine.ts`。

- `types.ts` Task / Attempt / SandboxSpec / TestCaseResult 等
- `machine.ts` 两台状态机：Task 是市场相位，Attempt 是候选人进度。跨机器不变量走 `checkTaskAttemptConsistency`。
- `run.ts` SandboxRun 聚合必须从 TestCaseResult 对账
- `award.ts` 分账比例来自合同；协作微奖走 `canIssueCooperativeAward`
- `dispute.ts` 争议中不能付
- `expire.ts` 只有 open/active 可过期
- `stability.ts` 稳定期证据才能 accepted
- `slot.ts` approval_required → applied
- `claim.ts` 口令认领；钱包不是认领
- `copy.ts` 中文标签
- `copy.ts` 中文标签

改状态机必须同时改 `docs/state-machine.md`。

拟中标是 Attempt 状态。Winner ≠ Paid 是 Task（accepted → settling → closed）。
