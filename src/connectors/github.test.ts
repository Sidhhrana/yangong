import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SAMPLE_ISSUE_BODY,
  issueBodyToDraft,
  parseIssueUrl,
  parsePrUrl,
} from "./github.ts";

const catalog = {
  suites: [{ id: "suite-voice", key: "voice/realtime-interruption-v1" }],
  specs: [{ id: "spec-voice", key: "voice-runtime-v3.2" }],
};

test("parseIssueUrl 只认 issues，不认 pull", () => {
  const hit = parseIssueUrl("https://github.com/lilei0311/yangong/issues/5?foo=1");
  assert.equal(hit?.number, 5);
  assert.equal(hit?.repo, "yangong");
  assert.equal(parseIssueUrl("https://github.com/lilei0311/yangong/pull/5"), null);
  assert.equal(parseIssueUrl("https://example.com/issues/5"), null);
});

test("parsePrUrl 只认 pull", () => {
  const hit = parsePrUrl("https://github.com/example/openclaw/pull/418#discussion");
  assert.equal(hit?.number, 418);
  assert.equal(parsePrUrl("https://github.com/lilei0311/yangong/issues/5"), null);
});

test("issue 模板体变成草稿，不把 github id 写进领域字段名", () => {
  const draft = issueBodyToDraft(
    {
      title: "[Task] GitHub App：Issue → Task，PR URL → Submission",
      body: SAMPLE_ISSUE_BODY,
      url: "https://github.com/lilei0311/yangong/issues/5",
    },
    catalog,
  );
  assert.equal(draft.sourceType, "github_issue");
  assert.equal(draft.sourceUrl, "https://github.com/lilei0311/yangong/issues/5");
  assert.equal(draft.suiteIds[0], "suite-voice");
  assert.equal(draft.sandboxSpecId, "spec-voice");
  assert.equal(draft.participationMode, "exclusive");
  assert.equal(draft.pool, 0);
  assert.equal(draft.currency, "CNY");
  assert.ok(draft.objective.includes("不要把 GitHub 写进领域内核"));
  assert.ok(draft.constraints.some((c) => c.includes("source_type")));
  assert.equal("githubIssueId" in draft, false);
  assert.ok(draft.acceptance.some((a) => a.includes("Octokit")));
});

test("缺验收和套件要给 warning，不假装合同完整", () => {
  const draft = issueBodyToDraft(
    { title: "空", body: "### Objective\n\n只有目标", url: "https://github.com/a/b/issues/1" },
    catalog,
  );
  assert.ok(draft.warnings.includes("missing_acceptance"));
  assert.ok(draft.warnings.includes("no_suite_mapped"));
});
