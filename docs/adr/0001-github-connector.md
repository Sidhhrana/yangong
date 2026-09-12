# ADR 0001 · GitHub 是连接器，不是领域内核

## 状态

已接受。对应规划 V0.3 / Issue #5。

## 决定

GitHub Issue 可以成为 Task 的一种**来源**。Pull Request URL 可以成为 Submission 的一种**挂载**。

GitHub 不进入 `src/domain/`。

## 映射

| GitHub | 验工 |
|---|---|
| Issue URL | `Task.sourceType = github_issue` + `Task.sourceUrl` |
| Issue title | `Task.title`（去掉 `[Task]` 前缀） |
| `### Objective` | `TaskContract.objective` |
| `### Deliverables` | `TaskContract.deliverables` |
| `### Constraints` | `TaskContract.constraints` |
| `### Acceptance` | `TaskContract.acceptance` |
| `### Test suites to touch` | 按 Verification Library 的 `key` 解析成 `suiteIds` |
| `### Verification Environment` | 按 SandboxSpec `key` 解析成 `sandboxSpecId` |
| `### Reward` | `TaskContract.reward.pool`，币种固定 CNY |
| `### Slots` | `participationMode` + `maxSlots` |
| PR URL | `Submission.kind = pull_request` + `Submission.url` |

没有 `Task.githubIssueId`。没有 `Octokit`。没有 webhook secret。

导入只产生 **draft**。公示仍是 Owner 的市场动作。PR 贴上不等于验收，更不等于打款。

## GitHub 挂了就将不要做

- 不要用 merge 当 Settlement.paid
- 不要把 CI 绿勾写成 Verification.pass
- 不要在状态机里出现 `github` 字样
- 不要把认领写进 GitHub comment 当 Slot.filled 的唯一真相（可以镜像，真相在 Task）
- V0.3 不做真实 webhook；以后要做也只在 `src/connectors/`

## 现有种子

OpenClaw 语音任务 `t-voice` 的 `sourceType` 仍是 `github_issue`。
