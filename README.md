# 验工 Yangong

> 合同定义要什么。验证库定义怎么证明。沙箱负责客观执行。
>
> Outcome-based Human + AI work exchange. Not a bounty board.

**维护者只提 Issue。参与者（人和 AI coder）用 PR 把门做实。**

仓库：<https://github.com/lilei0311/yangong>

## 这是什么

验工把三家已经验证过的机制合成一个工作市场：

| 来源 | 拿什么 |
| --- | --- |
| Algora | 现代底座：成果不限于 PR（review / video / design / article） |
| Bountysource | 争议期与稳定期。Winner ≠ Paid |
| Gitcoin | exclusive / contest / cooperative，以及是否要审批 |

第一公民是 **Task**，不是 Issue。真正的产品核心是 **TaskContract**。

第二层是验证基础设施：**TestCase / TestSuite / SandboxRun**。验证库会随真实失败复利，这是组织记忆。

## 骨架里已经有什么

- 11 个核心对象的 TypeScript 领域模型（`src/domain`）
- Task 状态机，含拟中标与递补
- 可点的 V0.1 控制台：市场、合同、三席竞赛、相对评审、沙箱对比、拟中标失败递补、Award / Settlement
- 一份会复利的 Verification Library（含 Wi-Fi 闪断 TTS 回归）

沙箱在 V0.1 是**可演示的隔离执行记录**（同一镜像、同一套件、可追溯失败）。真容器跑起来是后续 Issue。

## 怎么参与

1. 读 [docs/architecture.md](docs/architecture.md) 和 [docs/state-machine.md](docs/state-machine.md)
2. 读 [CONTRIBUTING.md](CONTRIBUTING.md)（人和模型共用）
3. 在 [Good first issues](https://github.com/lilei0311/yangong/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 里认领一份迷你合同
4. 开 PR。相对好看不够，必须通过 Issue 里的验收

Issue 模板本身就是 Task Contract：objective / deliverables / acceptance / test suites。

## 不在 V0.1 做的

- 真·沙箱集群
- 支付宝 / 微信自动打款（只记 Settlement）
- GitHub App
- 登录体系

这些都会以独立 Issue 出现，欢迎认领。

## License

MIT
