/**
 * GitHub is a connector. It does not live in the domain kernel.
 * No Octokit. No webhook secret. No github_issue_id field on Task.
 */

import type { ParticipationMode } from "../domain/types.ts";

export type GitHubIssueRef = {
  owner: string;
  repo: string;
  number: number;
  url: string;
};

export type GitHubPullRef = {
  owner: string;
  repo: string;
  number: number;
  url: string;
};

export type ConnectorCatalog = {
  suites: { id: string; key: string }[];
  specs: { id: string; key: string }[];
};

export type IssueImportDraft = {
  title: string;
  objective: string;
  deliverables: string[];
  constraints: string[];
  acceptance: string[];
  suiteIds: string[];
  suiteKeys: string[];
  sandboxSpecId?: string;
  sandboxKey?: string;
  pool: number;
  currency: "CNY";
  participationMode: ParticipationMode;
  maxSlots: number | "unlimited";
  sourceType: "github_issue";
  sourceUrl: string;
  warnings: string[];
};

const ISSUE_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)(?:[/?#]|$)/i;
const PR_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)(?:[/?#]|$)/i;

export function parseIssueUrl(raw: string): GitHubIssueRef | null {
  const m = raw.trim().match(ISSUE_RE);
  if (!m) return null;
  return {
    owner: m[1],
    repo: m[2],
    number: Number(m[3]),
    url: `https://github.com/${m[1]}/${m[2]}/issues/${m[3]}`,
  };
}

export function parsePrUrl(raw: string): GitHubPullRef | null {
  const m = raw.trim().match(PR_RE);
  if (!m) return null;
  return {
    owner: m[1],
    repo: m[2],
    number: Number(m[3]),
    url: `https://github.com/${m[1]}/${m[2]}/pull/${m[3]}`,
  };
}

export function issueBodyToDraft(
  input: { title: string; body: string; url: string },
  catalog: ConnectorCatalog,
): IssueImportDraft {
  const sections = splitSections(input.body);
  const warnings: string[] = [];
  const objective = textOf(sections, ["objective", "目标"]) || input.title;
  if (!textOf(sections, ["objective", "目标"])) warnings.push("missing_objective");

  const deliverables = bullets(textOf(sections, ["deliverables", "交付物"]));
  const constraints = bullets(textOf(sections, ["constraints", "约束"]));
  const acceptance = bullets(textOf(sections, ["acceptance", "验收"]));
  if (acceptance.length === 0) warnings.push("missing_acceptance");

  const suiteKeys = keysOf(textOf(sections, ["test suites to touch", "suites", "验证套件"]));
  const suiteIds = suiteKeys
    .map((key) => catalog.suites.find((s) => s.key === key || s.key.endsWith(key) || key.endsWith(s.key))?.id)
    .filter((id): id is string => Boolean(id));
  const unmatchedSuites = suiteKeys.filter(
    (key) => !catalog.suites.some((s) => s.key === key || s.key.endsWith(key) || key.endsWith(s.key)),
  );
  if (unmatchedSuites.length) warnings.push(`unknown_suites:${unmatchedSuites.join(",")}`);
  if (suiteIds.length === 0) warnings.push("no_suite_mapped");

  const sandboxKey = keysOf(textOf(sections, ["verification environment", "sandbox", "验证环境"]))[0];
  const sandboxSpecId = sandboxKey
    ? catalog.specs.find((s) => s.key === sandboxKey || sandboxKey.includes(s.key) || s.key.includes(sandboxKey))?.id
    : undefined;
  if (sandboxKey && !sandboxSpecId) warnings.push(`unknown_sandbox:${sandboxKey}`);

  const pool = parseReward(textOf(sections, ["reward", "奖池", "报酬"]));
  if (pool === null) warnings.push("missing_reward");

  const slots = parseSlots(textOf(sections, ["slots", "席位"]));

  return {
    title: stripIssueTitle(input.title),
    objective,
    deliverables,
    constraints,
    acceptance,
    suiteIds,
    suiteKeys,
    sandboxSpecId,
    sandboxKey,
    pool: pool ?? 0,
    currency: "CNY",
    participationMode: slots.mode,
    maxSlots: slots.maxSlots,
    sourceType: "github_issue",
    sourceUrl: parseIssueUrl(input.url)?.url ?? input.url,
    warnings,
  };
}

export const SAMPLE_ISSUE_BODY = `### Objective

让 GitHub Issue 成为 Task 的一种来源，让 PR URL 成为 Submission 的一种挂载。不要把 GitHub 写进领域内核。

### Deliverables

- Connector 映射 Issue 字段 → TaskContract
- Submission.kind = pull_request 的接入点
- 明确写：GitHub 挂了就将不要做

### Constraints

- 不要修改 src/domain/machine.ts 的主线状态
- 不要在 Task 上硬编码 github_issue_id，用 source_type / source_url
- V0.1 不做真实 webhook

### Acceptance

- 有一份 ADR，说清 Issue 如何变成 TaskContract
- 现有 OpenClaw 语音任务的 source_type 仍是 github_issue
- 领域模型没有出现 Octokit / webhook secret

### Test suites to touch

voice/realtime-interruption-v1

### Verification Environment

voice-runtime-v3.2

### Reward

¥0 OSS contract · Winner ≠ Paid

### Slots

exclusive (1)
`;

function splitSections(body: string) {
  const map = new Map<string, string>();
  const parts = body.replace(/\r\n/g, "\n").split(/^#{1,3} /m);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    if (nl < 0) continue;
    const heading = part.slice(0, nl).trim().toLowerCase();
    const content = part.slice(nl + 1).trim();
    if (heading) map.set(heading, content);
  }
  return map;
}

function textOf(sections: Map<string, string>, names: string[]) {
  for (const name of names) {
    for (const [k, v] of sections) {
      if (k === name || k.startsWith(name)) return v;
    }
  }
  return "";
}

function bullets(text: string) {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*[-*+]\s+/, "").replace(/^\s*\[[ xX]\]\s+/, "").trim())
    .filter(Boolean);
}

function keysOf(text: string) {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseReward(text: string): number | null {
  if (!text.trim()) return null;
  const m = text.replace(/,/g, "").match(/¥?\s*(\d+)/);
  if (!m) return null;
  return Number(m[1]);
}

function parseSlots(text: string): { mode: ParticipationMode; maxSlots: number | "unlimited" } {
  const t = text.toLowerCase();
  if (t.includes("cooperative") || t.includes("协作")) return { mode: "cooperative", maxSlots: "unlimited" };
  if (t.includes("contest") || t.includes("竞赛")) return { mode: "contest", maxSlots: 3 };
  return { mode: "exclusive", maxSlots: 1 };
}

function stripIssueTitle(title: string) {
  return title.replace(/^\s*\[(task|bounty)[^\]]*\]\s*/i, "").trim() || title;
}
