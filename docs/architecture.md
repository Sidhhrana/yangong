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

Evaluation 回答「谁更好」。Verification 回答「合不合格」。二者必须分开。

SandboxRun 不能只给 47/50。必须能回答：TC-VOICE-017 期望什么、实际什么、日志在哪。这是 TestCaseResult。

## 与 HAO OS 的关系

[Human-AI Organization OS](https://github.com/lilei0311/human-ai-organization-os) 是组织控制平面（授权、预算、审计、Harness）。验工是它面向社区的第一个**工作市场场景**：把合同、验证、结算做成可共建的产品。HAO OS 目前仍是私有基线；验工仓库公开，供全社区提 PR。
