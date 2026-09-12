export const TASK_STATUSES = [
  "draft",
  "open",
  "active",
  "judging",
  "accepted",
  "settling",
  "closed",
  "rejected",
  "cancelled",
  "disputed",
  "expired",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const MAINLINE_STATUSES: TaskStatus[] = [
  "draft",
  "open",
  "active",
  "judging",
  "accepted",
  "settling",
  "closed",
];

export const SIDE_STATUSES: TaskStatus[] = [
  "rejected",
  "cancelled",
  "disputed",
  "expired",
];

export const ATTEMPT_STATUSES = [
  "claimed",
  "working",
  "submitted",
  "evaluating",
  "qualified",
  "disqualified",
  "provisional",
  "verifying",
  "passed",
  "failed",
  "stability",
  "accepted",
  "withdrawn",
] as const;

export type AttemptStatus = (typeof ATTEMPT_STATUSES)[number];

export type ParticipationMode = "exclusive" | "contest" | "cooperative";
export type TaskType =
  | "code"
  | "review"
  | "design"
  | "article"
  | "video"
  | "deployment"
  | "research"
  | "other";

export type SubmissionKind =
  | "pull_request"
  | "commit"
  | "document"
  | "pdf"
  | "video"
  | "url"
  | "figma"
  | "test_report"
  | "deployment_record"
  | "dataset"
  | "photo"
  | "evidence";

export type CaseKind =
  | "automated"
  | "rubric"
  | "checklist"
  | "benchmark"
  | "regression";

export type SlotStatus =
  | "open"
  | "applied"
  | "filled"
  | "withdrawn"
  | "eliminated";

export type VerificationOutcome = "pending" | "pass" | "fail";

export type ActorRole = "owner" | "contributor" | "reviewer";

export interface Person {
  id: string;
  handle: string;
  name: string;
  title: string;
  kind: "human" | "agent";
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  blurb: string;
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
  slug: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  taskType: TaskType;
  sourceType: "github_issue" | "manual" | "incident";
  sourceUrl?: string;
  rewardPool: number;
  currency: "CNY";
  participationMode: ParticipationMode;
  maxSlots: number | "unlimited";
  access: "permissionless" | "approval_required";
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  /** Pointer only. 拟中标是 Attempt 的事，不把候选人进度写回 Task。 */
  provisionalAttemptId?: string;
}

export interface TaskContract {
  taskId: string;
  objective: string;
  inputs: string[];
  deliverables: string[];
  constraints: string[];
  acceptance: string[];
  suiteIds: string[];
  sandboxSpecId: string;
  verification: {
    type: "sandbox_test" | "expert_review" | "runtime_stability" | "rubric";
    stabilityPeriod: string;
  };
  reward: {
    pool: number;
    currency: "CNY";
    /** 比例，三项之和为 1。缺省用 DEFAULT_SPLIT。 */
    split?: { base: number; quality: number; upstream: number };
  };
}

export interface Slot {
  id: string;
  taskId: string;
  index: number;
  personId?: string;
  status: SlotStatus;
  appliedAt?: string;
}

/** One work cycle on a Slot. Contest 三人可以同时处于不同 Attempt 状态。 */
export interface Attempt {
  id: string;
  taskId: string;
  slotId: string;
  personId: string;
  submissionId?: string;
  status: AttemptStatus;
  startedAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  slotId: string;
  attemptId: string;
  personId: string;
  kind: SubmissionKind;
  title: string;
  url: string;
  note: string;
  submittedAt: string;
}

export interface Evaluation {
  id: string;
  taskId: string;
  attemptId: string;
  submissionId: string;
  score: number;
  rank: number;
  method: "ai_review" | "expert" | "blend";
  summary: string;
  dimensions: { name: string; score: number }[];
}

export interface TestCase {
  id: string;
  suiteId: string;
  code: string;
  title: string;
  kind: CaseKind;
  required: boolean;
  description: string;
  origin: "authored" | "regression";
  originNote?: string;
}

export interface TestSuite {
  id: string;
  key: string;
  name: string;
  category: string;
  version: string;
  summary: string;
  caseCount: number;
}

/** Versioned environment. 测试内容 ≠ 测试环境。 */
export interface SandboxSpec {
  id: string;
  key: string;
  name: string;
  version: string;
  image: string;
  cpu: number;
  memoryGb: number;
  network: "restricted" | "allowlist" | "airgap" | "open";
  timeout: string;
  runtime?: Record<string, string>;
  services: string[];
  /** Names only. Never values. */
  secretNames: string[];
  fixtures: string[];
  summary: string;
}

export interface SandboxRun {
  id: string;
  taskId: string;
  attemptId: string;
  submissionId: string;
  specId: string;
  suiteIds: string[];
  image: string;
  status: "queued" | "running" | "completed";
  passed: number;
  total: number;
  p50Ms?: number;
  p95Ms?: number;
  interruptPct?: number;
  memoryMb?: number;
  failedCaseIds: string[];
  artifacts: string[];
  startedAt: string;
  finishedAt?: string;
}

export interface TestCaseResult {
  id: string;
  runId: string;
  caseId: string;
  attemptId: string;
  outcome: "pass" | "fail" | "skip";
  expected: string;
  actual: string;
  durationMs: number;
  failureReason?: string;
  artifacts: string[];
}

export interface Verification {
  id: string;
  taskId: string;
  attemptId: string;
  submissionId: string;
  runId?: string;
  outcome: VerificationOutcome;
  reason: string;
}

export interface Award {
  id: string;
  taskId: string;
  personId: string;
  attemptId: string;
  currency: "CNY";
  base: number;
  qualityBonus: number;
  upstreamBonus: number;
  total: number;
}

export interface Settlement {
  id: string;
  awardId: string;
  method: "alipay";
  currency: "CNY";
  status: "pending" | "paid" | "failed";
  amount: number;
  paidAt?: string;
  proof?: string;
}

export interface JournalEvent {
  id: string;
  taskId: string;
  at: string;
  kind: string;
  text: string;
}

export interface YangongState {
  people: Person[];
  orgs: Organization[];
  projects: Project[];
  tasks: Task[];
  contracts: TaskContract[];
  slots: Slot[];
  attempts: Attempt[];
  submissions: Submission[];
  evaluations: Evaluation[];
  suites: TestSuite[];
  cases: TestCase[];
  specs: SandboxSpec[];
  runs: SandboxRun[];
  caseResults: TestCaseResult[];
  verifications: Verification[];
  awards: Award[];
  settlements: Settlement[];
  journal: JournalEvent[];
  session: { actorId: string; role: ActorRole };
}
