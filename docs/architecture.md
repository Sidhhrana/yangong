# 验工架构 · V0.1

验工（Yangong）是一个 **Outcome-based Human + AI Work Exchange**。

它不是代码悬赏站。GitHub Issue 只是 Task 的一种来源。

公开仓库是 **Protocol / Domain Spec**。可点的控制台是托管预览，不把 App Builder 工程整包推进本仓库。

## 三层

```
1. Work Market
   Task / TaskContract / Slot / Attempt / Submission / Award / Settlement
   解决：谁来做、交什么、给多少钱

2. Verification Infrastructure
   TestCase / TestSuite / SandboxSpec / SandboxRun / TestCaseResult
   Evaluation / Verification
   解决：东西到底行不行、在哪证明、每一条为什么失败

3. Connectors
   Git / 文档 / 支付 / 身份
   可替换，不进入领域内核
```

GitHub 映射见 [ADR 0001](adr/0001-github-connector.md)：Issue URL → `sourceType` + `sourceUrl`，PR URL → `Submission.kind = pull_request`。领域里没有 Octokit，没有 `github_issue_id`。

支付宝映射见 [ADR 0002](adr/0002-alipay-settlement.md)：`Settlement.paid` 必须挂 16–32 位订单号。合 PR 不是打款。

身份见 [ADR 0003](adr/0003-identity-rails.md)：GitHub handle 和支付宝账号是两根轨。认领是 `Claim` 对象，口令 `claiming slot`。贴 `0x` 不是认领。

## 地基四件套

1. **TaskContract** 定义「我要什么」
2. **Verification Library** 定义「怎么证明」（TestCase / TestSuite）
3. **SandboxSpec** 定义「在哪里证明」（版本化环境）
4. **SandboxRun** 记录「这一次怎么证明的」（下面挂 TestCaseResult）

没有这四样，Owner 管不住大量 AI coder。支付模块以后也没有这四样重要。

## Task 和 Attempt 必须拆开

竞赛三席时，A 已提交在测、B 还在写、C 测失败。这时 Task 不能是 `submitted` 或 `verifying`。

- **Task** 只保留市场相位：draft → open → active → judging → accepted → settling → closed
- **Attempt** 才是候选人进度：claimed → … → provisional → verifying → passed / failed
- **Slot** 只是位子
- **Submission** 是 Attempt 挂上的成果

拟中标是 Attempt 状态。Task 上只留 `provisionalAttemptId` 指针。

## 判定

```
相对排名好  +  绝对验收合格  =  才能拟中标 / 最终中标
Winner ≠ Paid
拟中标失败 → 下一合格 Attempt 递补
```

Evaluation 回答「谁更好」。Verification 回答「合不合格」。二者必须分开。名次从分数推导，不是数组下标。第 1 名也可以绝对失败。运行时不按 submission id 查演示脚本。

SandboxRun 不能只给 47/50。必须能回答：TC-VOICE-017 期望什么、实际什么、日志在哪。这是 TestCaseResult。

## SandboxRunner

SandboxRunner 是 Verification Infrastructure 的执行边界，**不是 Connector**。

- 吃整份 `SandboxSpec` + Submission + suiteIds
- 吐 `SandboxRun` + `TestCaseResult[]`
- 聚合必须走 `reconcile`。未列出的用例视为通过，total 来自库存。重复 caseId 算一次，冲突结论拒绝。
- P95 是 `TC-VOICE-004`，合同写在 expected：`P95 < 800ms`。800ms 不是过。不是 Verification 旁路。
- 不改 Task，不写 Verification，不碰状态机
- `secretNames` 只有名
- 内存实现：`InMemoryVoiceRunner`（`voice-runtime-v3.2`）。换 Docker 只换 Runner

GitHub / 支付宝 / 身份才是 Connector，见 ADR 0001–0003。

## 与 HAO OS 的关系

[Human-AI Organization OS](https://github.com/lilei0311/human-ai-organization-os) 是组织控制平面（授权、预算、审计、Harness）。验工是它面向社区的第一个**工作市场场景**：把合同、验证、结算做成可共建的产品。HAO OS 目前仍是私有基线；验工仓库公开，供全社区提 PR。

## Connectors

Connector 层负责将 **Verification Infrastructure** 与外部执行环境解耦。核心接口包括 `SandboxRunner`，它接受 `Submission`、`SandboxSpec` 与待执行的 `suiteIds`，返回 `SandboxRun` 与 `TestCaseResult[]`。实现可以是基于 Docker/K8s 的真实容器，也可以是纯内存的模拟（如本仓库提供的 `InMemoryVoiceRunner`），只要遵循接口约定即可。

这样，业务层无需感知运行时细节，能够自由替换实现而不影响领域模型。