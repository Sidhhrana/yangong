# Domain kernel

这里是验工的第一公民。UI、支付、GitHub App 都不要污染这一层。

GitHub 和支付宝在 `src/connectors/`。改连接器不要改 `machine.ts`。

- `types.ts` Task / Attempt / SandboxSpec / TestCaseResult 等
- `machine.ts` 两台状态机：Task 是市场相位，Attempt 是候选人进度
- `copy.ts` 中文标签

改状态机必须同时改 `docs/state-machine.md`。

拟中标是 Attempt 状态。Winner ≠ Paid 是 Task（accepted → settling → closed）。
