export const TASK_STATUSES = [
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
  "rejected",
  "cancelled",
  "disputed",
  "expired",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const MAINLINE_STATUSES: TaskStatus[] = [
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
];

export const SIDE_STATUSES: TaskStatus[] = [
  "rejected",
  "cancelled",
  "disputed",
  "expired",
];

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
  provisionalSubmissionId?: string;
}

export interface TaskContract {
  taskId: string;
  objective: string;
  inputs: string[];
  deliverables: string[];
  constraints: string[];
  acceptance: string[];
  suiteIds: string[];
  verification: {
    type: "sandbox_test" | "expert_review" | "runtime_stability" | "rubric";
    stabilityPeriod: string;
  };
  reward: { pool: number; currency: "CNY" };
}

export interface Slot {
  id: string;
  taskId: string;
  index: number;
  personId?: string;
  status: SlotStatus;
  appliedAt?: string;
}

export interface Submission {
  id: string;
  taskId: string;
  slotId: string;
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

export interface SandboxRun {
  id: string;
  taskId: string;
  submissionId: string;
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

export interface Verification {
  id: string;
  taskId: string;
  submissionId: string;
  runId?: string;
  outcome: VerificationOutcome;
  reason: string;
}

export interface Award {
  id: string;
  taskId: string;
  personId: string;
  base: number;
  qualityBonus: number;
  upstreamBonus: number;
  total: number;
}

export interface Settlement {
  id: string;
  awardId: string;
  method: "alipay" | "wechat" | "bank" | "manual";
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
  submissions: Submission[];
  evaluations: Evaluation[];
  suites: TestSuite[];
  cases: TestCase[];
  runs: SandboxRun[];
  verifications: Verification[];
  awards: Award[];
  settlements: Settlement[];
  journal: JournalEvent[];
  session: { actorId: string; role: ActorRole };
}
