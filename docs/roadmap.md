# Roadmap

## V0.1 · 骨架（本仓库现在）

- [x] 领域模型：Task / Attempt 拆开
- [x] 两台状态机（拟中标在 Attempt，Winner ≠ Paid 在 Task）
- [x] SandboxSpec + TestCaseResult
- [x] Verification Library 种子
- [x] 可点控制台演示 OpenClaw 语音三席竞赛（托管预览）
- [x] 公开 GitHub + Contract 式 Issue 模板

公开仓库是 Protocol / Domain Spec，不是完整应用工程。

## V0.2 · 把控制台做成能发合同的市场

- [x] voice / review / deploy 套件各 + 回归（TC-VOICE-018 / TC-REV-004 可判定 / TC-DEP-006）
- [ ] SandboxRunner 适配器：吃 SandboxSpec，吐 SandboxRun + TestCaseResult[]（不接真容器）← 社区 #3
- [x] 任务创建表单（Owner 发合同）
- [x] Award 从合同奖池出账
- [x] 评审任务走量表，禁止复用语音脚本
- [x] 协作猎虫：投标人可提交回归
- [x] 两台状态机非法迁移单测
- [x] Owner 运营台：待公示 / 待裁决 / 待支付
- [x] 投标人提交成果（实施记录 / 备忘 / PR）
- [x] 独占实施可走完现场清单
- [x] 协作微奖：有效回归 → ¥100 支付宝待付，任务继续开放

## V0.3 · 连接器

- [x] GitHub：Issue → 草稿合同，PR URL → Submission（无 webhook、无 Octokit）
- [x] 人工结算凭证：支付宝订单号才能 paid
- [ ] 真·隔离沙箱（一个 task type 先打通，按 SandboxSpec 起环境）← 等 #3 适配器，不抢

## V0.4 · 规划里还是空话的机制

状态机和类型里已经有这些词。行为没有。要的是协议，不是按钮。

- [x] 争议期 Dispute。Bountysource 的核心，Task 有 `disputed`，没有对象、没有证据窗、没有「争议中不能付」
- [x] `approval_required` 真正审批。现在申领直接 `filled`，`Slot.applied` 是死枚举
- [x] 同一 Slot 下一次 Attempt。文档写「后续合同」，现场不会为修 barge-in 再占一席
- [x] 协作微奖记账。contest 一个 Winner 拆三份；cooperative 从池子里多次 Award，池子怎么耗尽
- [x] 稳定期要证据。现在是按钮。7 天里发生了什么必须能回答
- [x] design / video / article 验证库。`TaskType` 有这些字，套件是空的。Algora 的成果不只是 PR
- [x] 截止与过期。`Task.deadline` 是装饰，`expired` 是陷阱状态

真沙箱、自动打款、登录、把控制台整包开源，都不在这一波。

## 以后维护者只做的事

写 Issue。验收 PR。保护两台状态机。把事故写进验证库。
