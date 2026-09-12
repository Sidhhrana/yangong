import type {
  AttemptStatus,
  CaseKind,
  ParticipationMode,
  SubmissionKind,
  TaskStatus,
  TaskType,
} from "./types";
import type { ClaimKind, ClaimStatus } from "./claim";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "草稿",
  open: "公示",
  active: "进行中",
  judging: "裁决中",
  accepted: "已验收",
  settling: "待支付",
  closed: "已结算",
  rejected: "未通过",
  cancelled: "已取消",
  disputed: "争议中",
  expired: "已过期",
};

export const STATUS_HINT: Record<TaskStatus, string> = {
  draft: "合同尚未发布",
  open: "等待参赛者申领席位",
  active: "有人在做。各候选人的 Attempt 可以处于不同状态。",
  judging: "相对评审与绝对验证进行中。Task 不再表示某一个人到哪一步。",
  accepted: "相对排名好，且绝对验收合格。Winner ≠ Paid。",
  settling: "Award 已出，Settlement 未完成",
  closed: "钱已经付出去",
  rejected: "无合格候选人，或全部淘汰",
  cancelled: "发布方撤回",
  disputed: "进入争议期",
  expired: "超过截止时间",
};

export const ATTEMPT_LABEL: Record<AttemptStatus, string> = {
  claimed: "已占席",
  working: "交付中",
  submitted: "已提交",
  evaluating: "相对评审",
  qualified: "相对合格",
  disqualified: "相对淘汰",
  provisional: "拟中标",
  verifying: "沙箱验证",
  passed: "绝对合格",
  failed: "验证失败",
  stability: "稳定期",
  accepted: "已中标",
  withdrawn: "已退出",
};

export const TYPE_LABEL: Record<TaskType, string> = {
  code: "代码",
  review: "评审",
  design: "设计",
  article: "文章",
  video: "影像",
  deployment: "实施",
  research: "研究",
  other: "其他",
};

export const MODE_LABEL: Record<ParticipationMode, string> = {
  exclusive: "独占",
  contest: "竞赛",
  cooperative: "协作",
};

export const KIND_LABEL: Record<SubmissionKind, string> = {
  pull_request: "Pull Request",
  commit: "Commit",
  document: "文档",
  pdf: "PDF",
  video: "视频",
  url: "URL",
  figma: "Figma",
  test_report: "测试报告",
  deployment_record: "部署记录",
  dataset: "数据集",
  photo: "照片",
  evidence: "证据",
};

export const CASE_KIND_LABEL: Record<CaseKind, string> = {
  automated: "自动测试",
  rubric: "评分量表",
  checklist: "清单",
  benchmark: "基准",
  regression: "回归",
};

export const CLAIM_KIND_LABEL: Record<ClaimKind, string> = {
  claim: "口令认领",
  crypto: "链上钱包",
  noise: "不是认领",
};

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  pending: "待处理",
  accepted: "已占席",
  waitlist: "候补",
  rejected: "拒绝",
};

export const MAINLINE = [
  "draft",
  "open",
  "active",
  "judging",
  "accepted",
  "settling",
  "closed",
] as const;

export const ATTEMPT_MAINLINE = [
  "submitted",
  "evaluating",
  "qualified",
  "provisional",
  "verifying",
  "passed",
  "stability",
  "accepted",
] as const;
