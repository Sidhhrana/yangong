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

## V0.5 · 认领与身份（#3 现场沉淀）

- [x] `Claim` 对象。GitHub 评论不是认领
- [x] 口令 `claiming slot`。`0x` 钱包永远 rejected，先到也不占席
- [x] exclusive 一个 accepted，后来的有效口令 waitlist
- [x] 没有口令的 PR 不是 Winner
- [x] GitHub handle ≠ 支付宝账号（ADR 0003）
- [x] 事故进验证库 `market/claim-identity-v1`

## V0.6 · 相对评审是协议

- [x] 名次从分数推导，同分先提交者靠前
- [x] 低于门槛取消资格
- [x] 拟中标必须是仍合格里的第 1，不能跳号
- [x] 第 1 名绝对 FAIL 不改 Evaluation.rank
- [x] 无人绝对合格则否决任务
- [x] 事故进验证库 `market/evaluation-v1`

## V0.7 · 运行时不再查演示脚本

- [x] Evaluation 由专家记下维度分数，再锁定名次
- [x] Verification 由已记录的 TestCaseResult 提交；没有记录就没有结果
- [x] 语音三席是 seed 里的历史记录，不是点击后按 sub-a 查表
- [x] 回归从真实失败沉淀，不再写死 TC-VOICE-042
- [ ] SandboxRunner 仍是 #3

## 以后维护者只做的事

写 Issue。验收 PR。保护两台状态机。把事故写进验证库。
