# Domain kernel

这里是验工的第一公民。UI、支付、GitHub App 都不要污染这一层。

GitHub 和支付宝在 `src/connectors/`。改连接器不要改 `machine.ts`。

- `types.ts` Task / Attempt / SandboxSpec / TestCaseResult 等
- `machine.ts` 两台状态机：Task 是市场相位，Attempt 是候选人进度。跨机器不变量走 `checkTaskAttemptConsistency`。
- `run.ts` SandboxRun 聚合必须从 TestCaseResult 对账。重复算一次，冲突拒绝。
- `bound.ts` 合同阈值写在 TestCase.expected。`P95 < 800ms` 的 800 不是过。
- `sandbox.ts` SandboxRunner 接口。执行边界，不是 Connector。
- `in-memory-voice.ts` 语音夹具实现。换实现只换这个文件。
- `award.ts` 分账比例来自合同；协作微奖走 `canIssueCooperativeAward`
- `dispute.ts` 争议中不能付
- `expire.ts` 只有 open/active 可过期
- `stability.ts` 稳定期证据才能 accepted
- `slot.ts` approval_required → applied
- `claim.ts` 口令认领；钱包不是认领
- `evaluate.ts` 相对排名。第 1 名也可以绝对失败。分数从维度来。
- `verify.ts` 验收必须有记录。没有记录就没有结果。
- `copy.ts` 中文标签

改状态机必须同时改 `docs/state-machine.md`。

拟中标是 Attempt 状态。Winner ≠ Paid 是 Task（accepted → settling → closed）。
