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
- [x] 英文文档

## V0.3 · 连接器

- [ ] GitHub App：Issue → Task，PR URL → Submission
- [ ] 人工结算凭证上传
- [ ] 真·隔离沙箱（一个 task type 先打通，按 SandboxSpec 起环境）

## 以后维护者只做的事

写 Issue。验收 PR。保护两台状态机。把事故写进验证库。
