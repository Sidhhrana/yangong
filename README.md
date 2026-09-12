# 验工 Yangong

> 合同定义要什么。验证库定义怎么证明。SandboxSpec 定义在哪里证明。SandboxRun 记录证明过程。
>
> Outcome-based Human + AI work exchange. Not a bounty board.

**维护者只提 Issue。参与者（人和 AI coder）用 PR 把门做实。**

仓库：<https://github.com/lilei0311/yangong>

本仓库是 **V0.1 Protocol / Domain Spec**。领域模型、状态机、Issue 合同模板在这里。可点的控制台是托管预览，不把整包应用工程推进本仓库。

## 这是什么

验工把三家已经验证过的机制合成一个工作市场：

| 来源 | 拿什么 |
| --- | --- |
| Algora | 现代底座：成果不限于 PR（review / video / design / article） |
| Bountysource | 争议期与稳定期。Winner ≠ Paid |
| Gitcoin | exclusive / contest / cooperative，以及是否要审批 |

第一公民是 **Task**，不是 Issue。真正的产品核心是 **TaskContract**。

候选人进度在 **Attempt** 上。竞赛三席时，A 测着、B 写着、C 失败，Task 只是 `judging`，不会假装自己是 `verifying`。

## 地基四件套

1. **TaskContract** — 我要什么
2. **Verification Library** — 怎么证明（TestCase / TestSuite）
3. **SandboxSpec** — 在哪里证明（版本化环境）
4. **SandboxRun** — 这一次怎么证明的（下面挂 TestCaseResult）

SandboxRun 不能只说 47/50。必须能回答：TC-VOICE-017 期望什么、实际什么、日志在哪。

## 骨架里已经有什么

- TypeScript 领域模型（`src/domain`）：Task / Attempt 两台状态机
- SandboxSpec、TestCaseResult
- 验证库种子（`src/data/seed.ts`）
- Contract 式 Issue 模板（含 Verification Environment、Reward）

托管预览里可以走一遍：三席竞赛 → 相对评审 → 拟中标 → 同一 spec 下跑沙箱 → Alice 因 TC-VOICE-017 失败 → Bob 递补 → 稳定期 → Award / Settlement。

## 怎么参与

1. 读 [docs/architecture.md](docs/architecture.md) 和 [docs/state-machine.md](docs/state-machine.md)
2. 读 [CONTRIBUTING.md](CONTRIBUTING.md)（人和模型共用）
3. 在 [Good first issues](https://github.com/lilei0311/yangong/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 里认领一份迷你合同
4. 开 PR。相对好看不够，必须通过 Issue 里的验收

带 `bounty` 标签的 Issue 才付钱：**人民币，只支付宝**。不付链上钱包、Stripe、PayPal、微信。贴 `0x` 钱包不当认领。

Issue 模板本身就是 Task Contract：objective / deliverables / acceptance / test suites / sandbox spec / reward。

## 不在 V0.1 做的

- 真·沙箱集群
- 支付宝 / 微信自动打款（只记 Settlement；人工支付宝是现在的真钱通道）
- GitHub App
- 登录体系
- 把托管预览的应用壳整包开源（那是另一条合同）

这些都会以独立 Issue 出现，欢迎认领。

## License

MIT
