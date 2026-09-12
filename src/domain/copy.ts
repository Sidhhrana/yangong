import type {
  CaseKind,
  ParticipationMode,
  SubmissionKind,
  TaskStatus,
  TaskType,
} from "./types";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "草稿",
  open: "公示",
  claiming: "申领席位",
  in_progress: "进行中",
  submitted: "已提交",
  evaluating: "评审中",
  provisional_accepted: "拟中标",
  verifying: "验证中",
  stability_period: "稳定期",
  accepted: "已验收",
  payment_pending: "待支付",
  paid: "已结算",
  rejected: "未通过",
  cancelled: "已取消",
  disputed: "争议中",
  expired: "已过期",
};

export const STATUS_HINT: Record<TaskStatus, string> = {
  draft: "合同尚未发布",
  open: "等待参赛者申领",
  claiming: "席位正在被申领",
  in_progress: "席位已满，正在交付",
  submitted: "成果已齐，等待评审",
  evaluating: "比较谁更好，尚未判定合不合格",
  provisional_accepted: "相对最优，进入绝对验收",
  verifying: "沙箱正在客观执行证明",
  stability_period: "Winner ≠ Paid，观察回归",
  accepted: "相对排名好，且绝对验收合格",
  payment_pending: "Award 已出，Settlement 未完成",
  paid: "钱已经付出去",
  rejected: "无合格候选人，或全部淘汰",
  cancelled: "发布方撤回",
  disputed: "进入争议期",
  expired: "超过截止时间",
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

export const MAINLINE = [
  "draft",
  "open",
  "claiming",
  "in_progress",
  "submitted",
  "evaluating",
  "provisional_accepted",
  "verifying",
  "stability_period",
  "accepted",
  "payment_pending",
  "paid",
] as const;
