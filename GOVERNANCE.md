# 治理

V0.1 是 **maintainer-issues / community-PRs**。

| 角色 | 做什么 |
| --- | --- |
| Maintainer | 写 Task Contract 式 Issue、合并通过验收的 PR、保护两台状态机 |
| Contributor | 认领 Issue、提交 PR、把失败沉淀成回归 |
| Reviewer | 按合同验收，不按感觉 |

- `main` 是唯一发布分支。
- 改 `src/domain/machine.ts` 的 PR 必须同时改 `docs/state-machine.md`。
- Task 状态机与 Attempt 状态机分开。禁止把候选人进度写回 Task。
- 支付、身份、真沙箱不进入领域内核，走 Connector Issue。
- 本仓库公开，定位是 Protocol / Domain Spec。组织控制平面 HAO OS 仍是独立私有基线。
