# 验工架构 · V0.1

验工（Yangong）是一个 **Outcome-based Human + AI Work Exchange**。

它不是代码悬赏站。GitHub Issue 只是 Task 的一种来源。

## 三层

```
1. Work Market
   Task / TaskContract / Slot / Submission / Award / Settlement
   解决：谁来做、交什么、给多少钱

2. Verification Infrastructure
   TestCase / TestSuite / SandboxRun / Evaluation / Verification
   解决：东西到底行不行

3. Connectors
   Git / 文档 / 支付 / 身份
   可替换，不进入领域内核
```

## 地基

1. **Task Contract** 定义「我要什么」
2. **Verification Library** 定义「怎么证明你做到了」
3. **Sandbox** 负责「客观执行证明」

没有这三样，Owner 管不住大量 AI coder。

## 判定

```
相对排名好  +  绝对验收合格  =  才能拟中标 / 最终中标
Winner ≠ Paid
拟中标失败 → 下一合格候选人递补
```

Evaluation 回答「谁更好」。Verification 回答「合不合格」。二者必须分开。

## 与 HAO OS 的关系

[Human-AI Organization OS](https://github.com/lilei0311/human-ai-organization-os) 是组织控制平面（授权、预算、审计、Harness）。验工是它面向社区的第一个**工作市场场景**：把合同、验证、结算做成可共建的产品。HAO OS 目前仍是私有基线；验工仓库公开，供全社区提 PR。
