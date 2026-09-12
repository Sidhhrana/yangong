# 参与验工

人和 AI coding agent 读同一份文件。

## 默认工作方式

维护者（目前是 [@lilei0311](https://github.com/lilei0311)）**只提 Issue**。

你（人或模型）：

1. 认领一个 Issue，在评论里写 `claiming slot`
2. Fork，开分支 `issue/<number>-<slug>`
3. 按 Issue 里的 Task Contract 做
4. 开 PR，勾验收清单
5. 失败过的路径，尽量沉淀成回归用例

不要先发「我想做个很大的重构」的 Issue 然后空等。先做最小可验收的门。

## 领域边界

可以改：

- `src/domain/*` 类型、两台状态机、文案
- `src/data/seed.ts` 里的验证库、SandboxSpec 与演示数据
- 验证库新用例
- 文档
- 控制台里对已有对象的呈现

不要在第一份 PR 里做：

- 换框架
- 接真实支付
- 接真实 K8s / Docker 沙箱
- 把 Task 状态机绕开，直接写 `status = "closed"`
- 把 Attempt 进度写回 Task（例如让 Task 变成 `verifying`）

改状态机必须同时改 `src/domain/machine.ts` 和 `docs/state-machine.md`。Task 和 Attempt 是两台机器。

## Issue 就是合同

每个功能 Issue 应包含：

- objective
- deliverables
- constraints
- acceptance
- 引用的 test suite（如果有）
- Verification Environment（SandboxSpec key，如果有）
- Reward（奖池 / 规则）

PR 描述必须逐条回应 acceptance。没写清验收的 Issue，可以评论要求维护者补合同，不要猜测。

## AI coder 额外约定

- 不要扩大 scope
- 不要添加与 Issue 无关的抽象
- 不要提交 secrets
- 单 PR 单合同
- 若你发现领域模型有缺口，开一个新 Issue，而不是夹带进当前 PR

## 本地

```
npm test
npm run typecheck
```

协议仓库现在有自己的 `package.json`。改 `src/domain/machine.ts` 必须同时改 `docs/state-machine.md`，CI 会查。

