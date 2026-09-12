import type { TestCaseResult, YangongState } from "../domain/types.ts";
import { reconcile } from "../domain/run.ts";

export const OWNER_ID = "p-max";
export const ALICE_ID = "p-alice";
export const BOB_ID = "p-bob";
export const CAROL_ID = "p-carol";

export const VOICE_TASK = "t-voice";
export const REVIEW_TASK = "t-review";
export const DEPLOY_TASK = "t-deploy";
export const BUGS_TASK = "t-bugs";
export const RUNNER_TASK = "t-runner";

export const SPEC_VOICE = "spec-voice";
export const SPEC_REVIEW = "spec-review";
export const SPEC_FIELD = "spec-field";

export const ATT_A = "att-a";
export const ATT_B = "att-b";
export const ATT_C = "att-c";
export const ATT_DENIS = "att-denis";

export function createSeed(): YangongState {
  return {
    session: { actorId: OWNER_ID, role: "owner" },
    people: [
      { id: OWNER_ID, handle: "max", name: "Max", title: "Owner · MaxStorm", kind: "human" },
      { id: ALICE_ID, handle: "alice", name: "Alice", title: "语音交互", kind: "human" },
      { id: BOB_ID, handle: "bob", name: "Bob", title: "低延迟路径", kind: "human" },
      { id: CAROL_ID, handle: "carol", name: "Carol", title: "测试完备", kind: "agent" },
      { id: "p-denis", handle: "denis", name: "Denis", title: "架构评审", kind: "human" },
      { id: "p-erin", handle: "erin", name: "Erin", title: "现场实施", kind: "human" },
      { id: "p-hope", handle: "hopebeatz123-ux", name: "Hope", title: "贴了钱包", kind: "human" },
      { id: "p-kou", handle: "koukahuo-source", name: "Kou", title: "正席 · 口令", kind: "human" },
      { id: "p-zbz", handle: "zbzbdzb", name: "Zbz", title: "候补", kind: "human" },
      { id: "p-sid", handle: "Sidhhrana", name: "Sid", title: "未占席交 PR", kind: "human" },
    ],
    orgs: [
      {
        id: "org-maxstorm",
        name: "MaxStorm",
        slug: "maxstorm",
        blurb: "人承担外部责任，Agent 在授权边界内持续执行。",
      },
    ],
    projects: [
      { id: "proj-openclaw", orgId: "org-maxstorm", name: "OpenClaw", slug: "openclaw" },
      { id: "proj-aedes", orgId: "org-maxstorm", name: "Aedes Twin", slug: "aedes-twin" },
      { id: "proj-field", orgId: "org-maxstorm", name: "现场交付", slug: "field" },
    ],
    tasks: [
      {
        id: VOICE_TASK,
        projectId: "proj-openclaw",
        title: "为 OpenClaw 增加实时语音能力",
        summary:
          "竞赛三席。三人可以同时处于不同 Attempt 状态。相对排名好不等于合格。",
        taskType: "code",
        sourceType: "github_issue",
        sourceUrl: "https://github.com/lilei0311/yangong/issues/1",
        rewardPool: 3000,
        currency: "CNY",
        participationMode: "contest",
        maxSlots: 3,
        access: "approval_required",
        deadline: "2026-09-20T16:00:00+08:00",
        status: "judging",
        createdAt: "2026-09-01T09:00:00+08:00",
      },
      {
        id: REVIEW_TASK,
        projectId: "proj-aedes",
        title: "评审 Aedes Twin 运动控制架构",
        summary: "非代码任务。验证走量表：事实引用、覆盖率、矛盾检测、来源有效性。",
        taskType: "review",
        sourceType: "manual",
        rewardPool: 1800,
        currency: "CNY",
        participationMode: "contest",
        maxSlots: 3,
        access: "approval_required",
        deadline: "2026-09-18T18:00:00+08:00",
        status: "active",
        createdAt: "2026-09-04T11:00:00+08:00",
      },
      {
        id: DEPLOY_TASK,
        projectId: "proj-field",
        title: "到客户现场部署门禁联动",
        summary: "实施类任务。验收看服务可访问、健康检查、备份与回滚，而不是看 PR。",
        taskType: "deployment",
        sourceType: "manual",
        rewardPool: 5200,
        currency: "CNY",
        participationMode: "exclusive",
        maxSlots: 1,
        access: "approval_required",
        deadline: "2026-09-25T12:00:00+08:00",
        status: "open",
        createdAt: "2026-09-08T08:30:00+08:00",
      },
      {
        id: BUGS_TASK,
        projectId: "proj-openclaw",
        title: "OpenClaw 语音回归猎虫",
        summary: "协作模式。谁提交有效回归谁拿 ¥100，席位不互斥。",
        taskType: "code",
        sourceType: "incident",
        rewardPool: 1000,
        currency: "CNY",
        participationMode: "cooperative",
        maxSlots: 10,
        access: "permissionless",
        deadline: "2026-09-30T23:59:00+08:00",
        status: "open",
        createdAt: "2026-09-10T10:00:00+08:00",
      },
      {
        id: RUNNER_TASK,
        projectId: "proj-openclaw",
        title: "SandboxRunner 适配器",
        summary: "第一次真实结算仪式。exclusive 一席。贴钱包不是认领。Winner ≠ Paid。",
        taskType: "code",
        sourceType: "github_issue",
        sourceUrl: "https://github.com/lilei0311/yangong/issues/3",
        rewardPool: 200,
        currency: "CNY",
        participationMode: "exclusive",
        maxSlots: 1,
        access: "approval_required",
        deadline: "2026-09-19T18:00:00+08:00",
        status: "open",
        createdAt: "2026-09-12T06:19:00+08:00",
      },
    ],
    contracts: [
      {
        taskId: VOICE_TASK,
        objective: "为 OpenClaw 实现实时语音交互",
        inputs: ["upstream_repo", "architecture_docs", "voice-runtime-v3.2"],
        deliverables: ["source_code", "test_report", "documentation"],
        constraints: ["must_be_plugin", "cannot_modify_core"],
        acceptance: [
          "streaming_asr",
          "barge_in",
          "streaming_tts",
          "regression_tests_pass",
          "p95_latency_lt_800ms",
        ],
        suiteIds: ["suite-reliability", "suite-streaming", "suite-voice"],
        sandboxSpecId: SPEC_VOICE,
        verification: { type: "sandbox_test", stabilityPeriod: "7d" },
        reward: { pool: 3000, currency: "CNY" },
      },
      {
        taskId: REVIEW_TASK,
        objective: "独立评审 Aedes Twin 运动控制架构，给出可执行的风险与改进",
        inputs: ["architecture_docs", "control_loop_notes", "prior_incidents"],
        deliverables: ["review_memo", "risk_register", "cited_sources"],
        constraints: ["must_cite_primary_sources", "no_vendor_pitch"],
        acceptance: [
          "citation_coverage_gte_80",
          "contradiction_scan_clean",
          "sources_resolvable",
        ],
        suiteIds: ["suite-review"],
        sandboxSpecId: SPEC_REVIEW,
        verification: { type: "rubric", stabilityPeriod: "48h" },
        reward: { pool: 1800, currency: "CNY" },
      },
      {
        taskId: DEPLOY_TASK,
        objective: "在客户现场完成门禁联动上线，并留下可回滚证据",
        inputs: ["site_runbook", "network_diagram", "credential_vault"],
        deliverables: ["deployment_record", "health_snapshot", "rollback_drill"],
        constraints: ["no_production_write_without_owner", "airgap_compatible"],
        acceptance: [
          "service_reachable",
          "healthcheck_green",
          "backup_verified",
          "rollback_drill_pass",
        ],
        suiteIds: ["suite-deploy"],
        sandboxSpecId: SPEC_FIELD,
        verification: { type: "runtime_stability", stabilityPeriod: "72h" },
        reward: { pool: 5200, currency: "CNY" },
      },
      {
        taskId: BUGS_TASK,
        objective: "发现并沉淀 OpenClaw 语音路径上的有效回归",
        inputs: ["voice-realtime-v4.1", "incident_log"],
        deliverables: ["repro", "regression_case", "fix_optional"],
        constraints: ["case_must_be_deterministic"],
        acceptance: ["repro_confirmed", "case_merged_to_library"],
        suiteIds: ["suite-voice"],
        sandboxSpecId: SPEC_VOICE,
        verification: { type: "sandbox_test", stabilityPeriod: "24h" },
        reward: { pool: 1000, currency: "CNY" },
      },
      {
        taskId: RUNNER_TASK,
        objective: "把硬编码语音脚本收成可替换的 SandboxRunner。只交公开协议仓库。",
        inputs: ["SandboxSpec voice-runtime-v3.2", "VOICE_RUN_SCRIPT", "VOICE_CASE_SCRIPT"],
        deliverables: ["SandboxRunner 接口", "InMemoryVoiceRunner", "Node 原生测试", "Connector 边界说明"],
        constraints: ["no_docker", "no_new_runtime_deps", "secrets_names_only", "alipay_only"],
        acceptance: [
          "alice_017_fail_with_reason",
          "bob_017_pass",
          "carol_latency_fail",
          "claiming_slot_not_0x",
        ],
        suiteIds: ["suite-voice", "suite-claim"],
        sandboxSpecId: SPEC_VOICE,
        verification: { type: "sandbox_test", stabilityPeriod: "7d" },
        reward: { pool: 200, currency: "CNY" },
      },
    ],
    slots: [
      { id: "s-v-1", taskId: VOICE_TASK, index: 1, personId: ALICE_ID, status: "filled", appliedAt: "2026-09-02T10:00:00+08:00" },
      { id: "s-v-2", taskId: VOICE_TASK, index: 2, personId: BOB_ID, status: "filled", appliedAt: "2026-09-02T11:20:00+08:00" },
      { id: "s-v-3", taskId: VOICE_TASK, index: 3, personId: CAROL_ID, status: "filled", appliedAt: "2026-09-02T16:05:00+08:00" },
      { id: "s-r-1", taskId: REVIEW_TASK, index: 1, personId: "p-denis", status: "filled", appliedAt: "2026-09-05T09:00:00+08:00" },
      { id: "s-r-2", taskId: REVIEW_TASK, index: 2, status: "open" },
      { id: "s-r-3", taskId: REVIEW_TASK, index: 3, status: "open" },
      { id: "s-d-1", taskId: DEPLOY_TASK, index: 1, status: "open" },
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `s-b-${i + 1}`,
        taskId: BUGS_TASK,
        index: i + 1,
        status: "open" as const,
      })),
      {
        id: "s-run-1",
        taskId: RUNNER_TASK,
        index: 1,
        personId: "p-kou",
        status: "applied",
        appliedAt: "2026-09-12T09:33:00+08:00",
      },
    ],
    attempts: [
      { id: ATT_A, taskId: VOICE_TASK, slotId: "s-v-1", personId: ALICE_ID, submissionId: "sub-a", status: "submitted", startedAt: "2026-09-02T10:00:00+08:00" },
      { id: ATT_B, taskId: VOICE_TASK, slotId: "s-v-2", personId: BOB_ID, submissionId: "sub-b", status: "submitted", startedAt: "2026-09-02T11:20:00+08:00" },
      { id: ATT_C, taskId: VOICE_TASK, slotId: "s-v-3", personId: CAROL_ID, submissionId: "sub-c", status: "submitted", startedAt: "2026-09-02T16:05:00+08:00" },
      { id: ATT_DENIS, taskId: REVIEW_TASK, slotId: "s-r-1", personId: "p-denis", submissionId: "sub-denis", status: "submitted", startedAt: "2026-09-05T09:00:00+08:00" },
    ],
    submissions: [
      {
        id: "sub-a",
        taskId: VOICE_TASK,
        slotId: "s-v-1",
        attemptId: ATT_A,
        personId: ALICE_ID,
        kind: "pull_request",
        title: "plugin/voice-stream: barge-in + streaming TTS",
        url: "https://github.com/example/openclaw/pull/412",
        note: "完整打断路径，偏稳不偏快。",
        submittedAt: "2026-09-09T21:10:00+08:00",
      },
      {
        id: "sub-b",
        taskId: VOICE_TASK,
        slotId: "s-v-2",
        attemptId: ATT_B,
        personId: BOB_ID,
        kind: "pull_request",
        title: "low-latency voice path, shared buffer",
        url: "https://github.com/example/openclaw/pull/418",
        note: "P95 压到 710ms，打断略激进。",
        submittedAt: "2026-09-10T01:40:00+08:00",
      },
      {
        id: "sub-c",
        taskId: VOICE_TASK,
        slotId: "s-v-3",
        attemptId: ATT_C,
        personId: CAROL_ID,
        kind: "pull_request",
        title: "voice plugin with exhaustive harness",
        url: "https://github.com/example/openclaw/pull/421",
        note: "测试全绿，延迟偏保守。",
        submittedAt: "2026-09-10T08:05:00+08:00",
      },
      {
        id: "sub-denis",
        taskId: REVIEW_TASK,
        slotId: "s-r-1",
        attemptId: ATT_DENIS,
        personId: "p-denis",
        kind: "url",
        title: "Aedes Twin 运动控制架构评审备忘",
        url: "https://example.com/reviews/aedes-twin-control-loop",
        note: "钉死 control_loop notes @ v0.9.4 与 incident-log-2026.csv。",
        submittedAt: "2026-09-11T18:00:00+08:00",
      },
    ],
    evaluations: [],
    suites: [
      { id: "suite-reliability", key: "common/reliability-v2", name: "通用可靠性", category: "通用质量", version: "v2.0", summary: "启动、异常退出、超时、重试、资源泄漏。", caseCount: 5 },
      { id: "suite-streaming", key: "ai/streaming-v3", name: "流式模型", category: "AI Model", version: "v3.0", summary: "Streaming、Token Limit、Tool Calling、Provider Failure。", caseCount: 4 },
      { id: "suite-voice", key: "voice/realtime-interruption-v1", name: "实时语音打断", category: "Voice", version: "v4.2", summary: "ASR / TTS / barge-in / 延迟 / 噪声，含真实事故回归。", caseCount: 10 },
      { id: "suite-review", key: "review/architecture-rubric-v1", name: "架构评审量表", category: "评审", version: "v1.1", summary: "事实引用、覆盖率、矛盾、来源有效性。", caseCount: 4 },
      { id: "suite-deploy", key: "deployment/field-v1", name: "现场实施", category: "Deployment", version: "v1.1", summary: "安装、升级、回滚、恢复、健康检查。", caseCount: 7 },
      { id: "suite-design", key: "design/interaction-states-v1", name: "交互稿状态", category: "设计", version: "v1.0", summary: "焦点、对比度、组件状态表。缺一项就是不可交付。", caseCount: 3 },
      { id: "suite-video", key: "video/demo-screencast-v1", name: "演示录屏", category: "影像", version: "v1.0", summary: "合同路径必须出现，口播必须能听清，时长必须守约。", caseCount: 3 },
      { id: "suite-article", key: "article/technical-memo-v1", name: "技术备忘", category: "文章", version: "v1.0", summary: "论断有引用，命令能跑，版本钉死。", caseCount: 3 },
      { id: "suite-claim", key: "market/claim-identity-v1", name: "认领与身份", category: "市场", version: "v1.0", summary: "口令占席。钱包不是认领。GitHub 身份不是支付宝。未占席的 PR 不是 Winner。", caseCount: 5 },
      { id: "suite-eval", key: "market/evaluation-v1", name: "相对评审", category: "市场", version: "v1.0", summary: "排名从分数来。第 1 名也可以绝对失败。不能跳号拟中标。", caseCount: 4 },
    ],
    cases: [
      { id: "tc-rel-01", suiteId: "suite-reliability", code: "TC-REL-001", title: "冷启动成功", kind: "automated", required: true, description: "进程在 3s 内进入 ready。", origin: "authored" },
      { id: "tc-rel-02", suiteId: "suite-reliability", code: "TC-REL-002", title: "异常退出可恢复", kind: "automated", required: true, description: "SIGTERM 后无僵尸进程。", origin: "authored" },
      { id: "tc-rel-03", suiteId: "suite-reliability", code: "TC-REL-003", title: "上游超时", kind: "automated", required: true, description: "依赖 2s 无响应时有明确错误，不挂死。", origin: "authored" },
      { id: "tc-rel-04", suiteId: "suite-reliability", code: "TC-REL-004", title: "有限重试", kind: "automated", required: false, description: "瞬时失败最多重试 3 次。", origin: "authored" },
      { id: "tc-rel-05", suiteId: "suite-reliability", code: "TC-REL-005", title: "无资源泄漏", kind: "automated", required: true, description: "10 分钟稳态后 RSS 增长 < 8%。", origin: "authored" },
      { id: "tc-ai-01", suiteId: "suite-streaming", code: "TC-AI-001", title: "流式输出不打断", kind: "automated", required: true, description: "token 流连续，无整包缓冲。", origin: "authored" },
      { id: "tc-ai-02", suiteId: "suite-streaming", code: "TC-AI-002", title: "Token 上限", kind: "automated", required: true, description: "超限时优雅截断。", origin: "authored" },
      { id: "tc-ai-03", suiteId: "suite-streaming", code: "TC-AI-003", title: "工具调用", kind: "automated", required: true, description: "tool call 参数完整可解析。", origin: "authored" },
      { id: "tc-ai-04", suiteId: "suite-streaming", code: "TC-AI-004", title: "供应商失败", kind: "automated", required: true, description: "provider 5xx 时切换或报错，不吞掉会话。", origin: "authored" },
      { id: "tc-voice-01", suiteId: "suite-voice", code: "TC-VOICE-001", title: "流式 ASR", kind: "automated", required: true, description: "部分结果在 300ms 内出现。", origin: "authored" },
      { id: "tc-voice-02", suiteId: "suite-voice", code: "TC-VOICE-002", title: "流式 TTS", kind: "automated", required: true, description: "首包音频 < 400ms。", origin: "authored" },
      { id: "tc-voice-03", suiteId: "suite-voice", code: "TC-VOICE-003", title: "Barge-in", kind: "benchmark", required: true, description: "用户插话后 200ms 内停播。", origin: "authored" },
      { id: "tc-voice-04", suiteId: "suite-voice", code: "TC-VOICE-004", title: "P95 延迟 < 800ms", kind: "benchmark", required: true, description: "回合级 P95 必须低于合同阈值。", origin: "authored" },
      { id: "tc-voice-05", suiteId: "suite-voice", code: "TC-VOICE-005", title: "噪声鲁棒", kind: "automated", required: false, description: "SNR 10dB 下意图仍可解析。", origin: "authored" },
      { id: "tc-voice-17", suiteId: "suite-voice", code: "TC-VOICE-017", title: "Wi-Fi 闪断后 TTS 必须重连", kind: "regression", required: true, description: "断开 3 秒再恢复，TTS 不得永久卡死。", origin: "regression", originNote: "2026-08 现场：Wi-Fi 闪断 3s，TTS 永远无法重连。" },
      { id: "tc-voice-18", suiteId: "suite-voice", code: "TC-VOICE-018", title: "弱网下 barge-in < 200ms", kind: "regression", required: true, description: "在 200ms jitter 的弱网下，用户插话后 200ms 内必须停播。jitter 本身不算失败。停播超过 200ms、会话断开、或只把 jitter 当错误，均 FAIL。", origin: "regression", originNote: "预演：办公室 4G 热点 200ms jitter，插话后 TTS 又播了 1.4s。" },
      { id: "tc-voice-31", suiteId: "suite-voice", code: "TC-VOICE-031", title: "二次打断", kind: "regression", required: false, description: "连续两次 barge-in 不丢会话。", origin: "regression", originNote: "内部试跑发现。" },
      { id: "tc-voice-19", suiteId: "suite-voice", code: "TC-VOICE-019", title: "稳定期内 TTS 不得再次卡死", kind: "regression", required: true, description: "稳定期证据必须包含：周期内每一次网络闪断后 TTS 在 3s 内恢复。反例：健康检查绿、但第 2 天 Wi-Fi 闪断后 TTS 永久卡死 → FAIL。只写「等了 7 天没事」→ FAIL。", origin: "regression", originNote: "现场：验收当天过了 TC-VOICE-017，稳定期第 2 天同一闪断再次卡死，按钮跳过稳定期把钱付了。" },
      { id: "tc-net-04", suiteId: "suite-voice", code: "TC-NET-004", title: "弱网抖动", kind: "automated", required: false, description: "200ms jitter 下不崩溃。", origin: "authored" },
      { id: "tc-rev-01", suiteId: "suite-review", code: "TC-REV-001", title: "事实引用检查", kind: "rubric", required: true, description: "关键论断必须指向可解析来源。", origin: "authored" },
      { id: "tc-rev-02", suiteId: "suite-review", code: "TC-REV-002", title: "覆盖率", kind: "rubric", required: true, description: "合同列出的子系统均被覆盖。", origin: "authored" },
      { id: "tc-rev-03", suiteId: "suite-review", code: "TC-REV-003", title: "矛盾检测", kind: "rubric", required: true, description: "文档内部与上游文档无未解释矛盾。", origin: "authored" },
      { id: "tc-rev-04", suiteId: "suite-review", code: "TC-REV-004", title: "来源有效性", kind: "checklist", required: true, description: "每条引用必须同时满足：(1) URL 现在可解析（HTTP 2xx，不是 404/超时）；(2) 版本钉死为 commit SHA、tag 或带日期的规范编号，禁止 latest/master 浮动指向。反例：链接 404 → FAIL。反例：只写 https://docs.example.com/api 未钉版本 → FAIL。", origin: "authored" },
      { id: "tc-dep-01", suiteId: "suite-deploy", code: "TC-DEP-001", title: "服务可访问", kind: "checklist", required: true, description: "约定端口对外可探活。", origin: "authored" },
      { id: "tc-dep-02", suiteId: "suite-deploy", code: "TC-DEP-002", title: "健康检查", kind: "automated", required: true, description: "/health 返回 ready。", origin: "authored" },
      { id: "tc-dep-03", suiteId: "suite-deploy", code: "TC-DEP-003", title: "备份校验", kind: "checklist", required: true, description: "备份可还原到演练环境。", origin: "authored" },
      { id: "tc-dep-04", suiteId: "suite-deploy", code: "TC-DEP-004", title: "回滚演练", kind: "checklist", required: true, description: "一键回滚并恢复服务。", origin: "authored" },
      { id: "tc-dep-05", suiteId: "suite-deploy", code: "TC-DEP-005", title: "升级路径", kind: "checklist", required: false, description: "小版本升级不中断会话。", origin: "authored" },
      { id: "tc-dep-06", suiteId: "suite-deploy", code: "TC-DEP-006", title: "回滚后进行中的会话必须恢复", kind: "regression", required: true, description: "一键回滚之后，任何进行中的门禁会话必须在 30s 内恢复。只有进程起来或 /health 变绿不算通过。反例：回滚后 8s 内 /health 绿，但刷卡会话 token 全部失效 → FAIL。", origin: "regression", originNote: "现场预演：回滚后门禁服务很快 ready，进行中的刷卡会话全部掉线。" },
      { id: "tc-dep-07", suiteId: "suite-deploy", code: "TC-DEP-007", title: "稳定期内刷卡会话必须存活", kind: "regression", required: true, description: "稳定期证据必须证明周期内进行中的刷卡会话没有静默掉线。/health 持续 200 不够。反例：72h health 全绿，第 11 小时起新刷卡成功、旧会话 token 全部 401 → FAIL。", origin: "regression", originNote: "现场：稳定期按钮跳过 72h，次日客户发现昨夜的长开门授权全部失效。" },
      { id: "tc-des-01", suiteId: "suite-design", code: "TC-DES-001", title: "焦点态必须可见", kind: "checklist", required: true, description: "每个可点击控件要有 :focus-visible，不能只靠 hover。反例：自定义按钮只有 box-shadow on hover，键盘 Tab 过去看不出焦点 → FAIL。", origin: "regression", originNote: "设计评审：交付稿在 Figma 里用鼠标演示，无障碍验收时全键盘走不通。" },
      { id: "tc-des-02", suiteId: "suite-design", code: "TC-DES-002", title: "正文对比度", kind: "checklist", required: true, description: "正文与背景对比度 ≥ 4.5:1（WCAG AA）。反例：#9aa3 字印在 #f4f0e6 上，对比度约 2.4 → FAIL。只写「看起来挺清爽」→ FAIL。", origin: "regression", originNote: "户外平板：阳光下一片灰，保安看不清开门按钮标签。" },
      { id: "tc-des-03", suiteId: "suite-design", code: "TC-DES-003", title: "组件状态表", kind: "checklist", required: true, description: "每个组件必须画出 default / hover / disabled / loading / error。反例：只有一张 default 精美渲染，disabled 和 loading 交给开发「自己看着办」→ FAIL。", origin: "regression", originNote: "一次交付只有精美主态，开发在现场发明了一种转圈，把提交按钮转没了。" },
      { id: "tc-vid-01", suiteId: "suite-video", code: "TC-VID-001", title: "合同路径必须出现", kind: "checklist", required: true, description: "录屏必须完整走过合同验收列出的关键路径。反例：10 分钟演示没走到 barge-in，只秀了欢迎语 → FAIL。", origin: "regression", originNote: "语音插件演示片从头到尾在说架构，合同要的打断一次都没有。" },
      { id: "tc-vid-02", suiteId: "suite-video", code: "TC-VID-002", title: "口播可辨", kind: "checklist", required: true, description: "无字幕时口播必须能听清；有环境底噪必须加字幕。反例：咖啡厅底噪盖过讲解、又无字幕 → FAIL。", origin: "regression", originNote: "现场录的演示，评审回放时完全听不清验收口播。" },
      { id: "tc-vid-03", suiteId: "suite-video", code: "TC-VID-003", title: "时长守约", kind: "checklist", required: true, description: "成片时长 ≤ 合同约定。反例：合同 ≤5 分钟，成片 18 分钟 → FAIL。", origin: "regression", originNote: "给客户的「五分钟看懂」变成十八分钟口播，采购没看完。" },
      { id: "tc-art-01", suiteId: "suite-article", code: "TC-ART-001", title: "论断有引用", kind: "rubric", required: true, description: "关键论断必须指向可解析来源。反例：「业界都这么做」无链接、无论文、无 commit → FAIL。", origin: "regression", originNote: "一篇架构备忘用「大家都知道」带过控制环采样率选择。" },
      { id: "tc-art-02", suiteId: "suite-article", code: "TC-ART-002", title: "命令能跑", kind: "checklist", required: true, description: "文中给出的命令必须在仓库里存在且可运行。反例：README 写 npm run harvest，package.json 没有这个脚本 → FAIL。", origin: "regression", originNote: "新人按备忘敲命令，脚本根本不在仓库里。" },
      { id: "tc-art-03", suiteId: "suite-article", code: "TC-ART-003", title: "版本钉死", kind: "checklist", required: true, description: "依赖和上游文档必须钉 commit / tag / 日期，禁止 latest。反例：`npm i foo@latest` 或文档链到 master → FAIL。", origin: "regression", originNote: "三个月后 latest 升了大版本，备忘里的 API 全部 404。" },
      { id: "tc-mkt-01", suiteId: "suite-claim", code: "TC-MKT-001", title: "贴 0x 钱包不是认领", kind: "checklist", required: true, description: "评论文本含 0x + ≥20 hex 必须 kind=crypto、status=rejected。先到也不占 exclusive 席。反例：把钱包当 claiming slot → FAIL。", origin: "regression", originNote: "Issue #3：hopebeatz123-ux 在口令者之前贴了 Payout Wallet 0x5251…。" },
      { id: "tc-mkt-02", suiteId: "suite-claim", code: "TC-MKT-002", title: "exclusive 必须口令 claiming slot", kind: "checklist", required: true, description: "正文大小写不敏感包含 claiming slot 才是认领。长方案、Fixes #3、直接 PR 都是 noise。反例：无口令的设计文档占席 → FAIL。", origin: "regression", originNote: "Issue #3：koukahuo-source 写了 claiming slot，席位才给他。" },
      { id: "tc-mkt-03", suiteId: "suite-claim", code: "TC-MKT-003", title: "未占席的 PR 不是 Winner", kind: "checklist", required: true, description: "exclusive 已有 accepted Claim 时，后来的有效口令只能 waitlist。没有 Claim 的 PR 不能当中标。反例：抢跑 PR 自动合并且打款 → FAIL。", origin: "regression", originNote: "Issue #3：Sidhhrana 未写口令直接开 PR #12。Winner ≠ Paid。" },
      { id: "tc-mkt-04", suiteId: "suite-claim", code: "TC-MKT-004", title: "GitHub 身份不是支付宝账号", kind: "checklist", required: true, description: "Person.id 可以对应 GitHub handle，收款必须另绑支付宝手机号或邮箱。钱包、订单号、GitHub login 都不是收款账号。反例：merge 后往 0x 打钱 → FAIL。", origin: "regression", originNote: "维护者只有支付宝。Issue 里贴的钱包既不当认领，也不当收款。" },
      { id: "tc-mkt-05", suiteId: "suite-claim", code: "TC-MKT-005", title: "候补不等于占席", kind: "checklist", required: true, description: "alreadyAccepted 后的有效口令必须 waitlist，不得把 Slot 从已申请者抢走。反例：第二份 claiming slot 把正席踢掉 → FAIL。", origin: "regression", originNote: "Issue #3：zbzbdzb 申请递补，方案对齐协议，席位仍是 koukahuo-source。" },
      { id: "tc-eval-01", suiteId: "suite-eval", code: "TC-EVAL-001", title: "相对第 1 仍可绝对 FAIL", kind: "checklist", required: true, description: "Evaluation.rank=1 不能推出 Verification.pass。反例：Alice 91 分拟中标，TC-VOICE-017 失败后仍按排名发奖 → FAIL。", origin: "regression", originNote: "语音三席：相对最优的打断路径过不了闪断重连。" },
      { id: "tc-eval-02", suiteId: "suite-eval", code: "TC-EVAL-002", title: "不能跳号拟中标", kind: "checklist", required: true, description: "仍 qualified 或 passed 的更高名次还在时，不能把第 3 名设为 provisional。反例：第 2 名还合格，Owner 点了第 3 名 → FAIL。", origin: "regression", originNote: "控制台曾按 evaluations[0] 提名，数组下标不是名次。" },
      { id: "tc-eval-03", suiteId: "suite-eval", code: "TC-EVAL-003", title: "低于门槛取消资格", kind: "checklist", required: true, description: "score < 60 必须 disqualified，rank=0，不能进入拟中标候选。反例：52 分排第 3 然后被递补 → FAIL。", origin: "authored" },
      { id: "tc-eval-04", suiteId: "suite-eval", code: "TC-EVAL-004", title: "同分先提交者靠前", kind: "checklist", required: true, description: "score 相同按 Submission.submittedAt 升序。反例：后交的同分被排第 1 → FAIL。", origin: "authored" },
    ],
    specs: [
      {
        id: SPEC_VOICE,
        key: "voice-runtime-v3.2",
        name: "实时语音运行时",
        version: "v3.2",
        image: "voice-runtime:v3.2",
        cpu: 4,
        memoryGb: 8,
        network: "restricted",
        timeout: "20m",
        runtime: { node: "24" },
        services: ["redis"],
        secretNames: ["DEEPSEEK_API_KEY"],
        fixtures: ["noisy-room.wav", "interrupt-test.wav", "wifi-blip-3s.pcap"],
        summary: "三人同一镜像、同一夹具、无外网。半年后有人说「我当时过了」，用 spec + suite + commit 回答。",
      },
      {
        id: SPEC_REVIEW,
        key: "review-rubric-v1",
        name: "架构评审量表环境",
        version: "v1.0",
        image: "rubric-runner:v1",
        cpu: 1,
        memoryGb: 2,
        network: "allowlist",
        timeout: "30m",
        services: [],
        secretNames: [],
        fixtures: ["aedes-control-loop.pdf", "incident-log-2026.csv"],
        summary: "非代码任务也有环境：钉死的文档版本与可解析来源白名单。",
      },
      {
        id: SPEC_FIELD,
        key: "field-airgap-v1",
        name: "现场气隙验收",
        version: "v1.0",
        image: "none",
        cpu: 0,
        memoryGb: 0,
        network: "airgap",
        timeout: "72h",
        services: [],
        secretNames: ["SITE_VPN"],
        fixtures: ["rollback-drill.md"],
        summary: "实施任务的环境是现场，不是容器。仍然要版本化。",
      },
    ],
    runs: [],
    caseResults: [],
    verifications: [],
    awards: [],
    settlements: [],
    disputes: [],
    stabilityEvidence: [],
    claims: [
      {
        id: "cl-hope",
        taskId: RUNNER_TASK,
        personId: "p-hope",
        text: "Payout Wallet: 0x52513A733D4b52282F2b4f5A91D965D38b64f3BB",
        kind: "crypto",
        status: "rejected",
        createdAt: "2026-09-12T09:21:10Z",
      },
      {
        id: "cl-kou",
        taskId: RUNNER_TASK,
        personId: "p-kou",
        text: "claiming slot\n我使用 Hermes Agent 协助，收款只在验收合并后私下提供。",
        kind: "claim",
        status: "accepted",
        createdAt: "2026-09-12T09:30:48Z",
      },
      {
        id: "cl-zbz",
        taskId: RUNNER_TASK,
        personId: "p-zbz",
        text: "claiming slot\n申请递补。当前席位归 koukahuo-source。",
        kind: "claim",
        status: "waitlist",
        createdAt: "2026-09-12T10:10:47Z",
      },
      {
        id: "cl-sid",
        taskId: RUNNER_TASK,
        personId: "p-sid",
        text: "Fixes #3 Proposed Fix: SandboxRunner adapter",
        kind: "noise",
        status: "rejected",
        createdAt: "2026-09-12T11:05:41Z",
      },
    ],
    journal: [
      { id: "j1", taskId: VOICE_TASK, at: "2026-09-01T09:00:00+08:00", kind: "publish", text: "合同发布。模式 contest · 3 席 · 需审批。环境 voice-runtime-v3.2。" },
      { id: "j2", taskId: VOICE_TASK, at: "2026-09-02T16:05:00+08:00", kind: "slots", text: "三席已满：Alice / Bob / Carol。Task = active。" },
      { id: "j3", taskId: VOICE_TASK, at: "2026-09-10T08:05:00+08:00", kind: "submit", text: "三份 Attempt 均 submitted。Task 进入 judging。各候选人进度不再写回 Task。" },
      { id: "j4", taskId: REVIEW_TASK, at: "2026-09-11T18:00:00+08:00", kind: "submit", text: "Denis 提交评审备忘 URL。Task 仍是 active。量表还没跑。" },
    ],
  };
}

/** Predetermined sandbox outcomes — fair compare, same spec, same suites. */
export const VOICE_CASE_SCRIPT: Record<
  string,
  Omit<TestCaseResult, "id" | "runId" | "attemptId">[]
> = {
  "sub-a": [
    { caseId: "tc-voice-04", outcome: "fail", expected: "P95 < 800ms", actual: "920ms", durationMs: 48000, failureReason: "回合级尾延迟超合同阈值", artifacts: ["metrics.json"] },
    { caseId: "tc-voice-17", outcome: "fail", expected: "Wi-Fi 断开 3s 后 TTS 在 3s 内重连", actual: "TTS 永久卡死", durationMs: 14000, failureReason: "重连路径没有监听 network online", artifacts: ["logs", "audio", "wifi-blip-3s.pcap"] },
    { caseId: "tc-voice-31", outcome: "fail", expected: "连续两次 barge-in 保持会话", actual: "第二次打断后 session = null", durationMs: 860, failureReason: "共享缓冲被第一次打断释放", artifacts: ["trace"] },
  ],
  "sub-b": [
    { caseId: "tc-voice-04", outcome: "pass", expected: "P95 < 800ms", actual: "710ms", durationMs: 48000, artifacts: ["metrics.json"] },
    { caseId: "tc-voice-17", outcome: "pass", expected: "Wi-Fi 断开 3s 后 TTS 在 3s 内重连", actual: "1.1s 重连", durationMs: 4100, artifacts: ["logs"] },
    { caseId: "tc-voice-05", outcome: "fail", expected: "SNR 10dB 意图可解析", actual: "意图置信 0.31", durationMs: 1200, failureReason: "噪声模型未启用", artifacts: ["audio"] },
    { caseId: "tc-voice-31", outcome: "fail", expected: "连续两次 barge-in 保持会话", actual: "第二次打断丢 1 个 user turn", durationMs: 640, artifacts: ["trace"] },
    { caseId: "tc-net-04", outcome: "fail", expected: "200ms jitter 不崩溃", actual: "jitter 缓冲溢出", durationMs: 2200, artifacts: ["logs"] },
    { caseId: "tc-rel-04", outcome: "fail", expected: "瞬时失败最多重试 3 次", actual: "无限重试", durationMs: 9000, artifacts: ["logs"] },
  ],
  "sub-c": [
    { caseId: "tc-voice-04", outcome: "fail", expected: "P95 < 800ms", actual: "1300ms", durationMs: 48000, failureReason: "测试全绿但尾延迟超阈值。相对好看不够。", artifacts: ["metrics.json"] },
    { caseId: "tc-voice-17", outcome: "pass", expected: "Wi-Fi 断开 3s 后 TTS 在 3s 内重连", actual: "0.8s 重连", durationMs: 3800, artifacts: ["logs"] },
  ],
};

/** 合同 suiteIds 覆盖的用例库存。未在 CASE_SCRIPT 列出的视为 pass。 */
export const VOICE_CASE_TOTAL = 19;

const VOICE_METRICS: Record<string, { p50Ms: number; p95Ms: number; interruptPct: number; memoryMb: number }> = {
  "sub-a": { p50Ms: 610, p95Ms: 920, interruptPct: 98, memoryMb: 620 },
  "sub-b": { p50Ms: 480, p95Ms: 710, interruptPct: 91, memoryMb: 410 },
  "sub-c": { p50Ms: 820, p95Ms: 1300, interruptPct: 99, memoryMb: 390 },
};

export const VOICE_RUN_SCRIPT: Record<
  string,
  {
    passed: number;
    total: number;
    p50Ms: number;
    p95Ms: number;
    interruptPct: number;
    memoryMb: number;
    failedCaseIds: string[];
  }
> = Object.fromEntries(
  Object.entries(VOICE_CASE_SCRIPT).map(([id, rows]) => [
    id,
    { ...VOICE_METRICS[id], ...reconcile(rows, VOICE_CASE_TOTAL) },
  ]),
);

export const VOICE_EVAL_SCRIPT: Record<
  string,
  { score: number; summary: string; dimensions: { name: string; score: number }[] }
> = {
  "sub-a": {
    score: 91,
    summary: "结构清晰，打断路径完整。相对最优，但尚未证明绝对合格。",
    dimensions: [
      { name: "架构", score: 94 },
      { name: "打断", score: 93 },
      { name: "延迟", score: 78 },
      { name: "可维护", score: 90 },
    ],
  },
  "sub-b": {
    score: 86,
    summary: "延迟最好。打断略激进，可选用例有缺口。",
    dimensions: [
      { name: "架构", score: 84 },
      { name: "打断", score: 80 },
      { name: "延迟", score: 96 },
      { name: "可维护", score: 82 },
    ],
  },
  "sub-c": {
    score: 73,
    summary: "测试全覆盖，但 P95 明显高于合同 800ms 阈值。",
    dimensions: [
      { name: "架构", score: 80 },
      { name: "打断", score: 88 },
      { name: "延迟", score: 52 },
      { name: "可维护", score: 91 },
    ],
  },
};

export const REVIEW_RUN_SCRIPT: Record<
  string,
  { passed: number; total: number; failedCaseIds: string[] }
> = {
  "sub-denis": { passed: 4, total: 4, failedCaseIds: [] },
};

export const REVIEW_CASE_SCRIPT: Record<
  string,
  Omit<TestCaseResult, "id" | "runId" | "attemptId">[]
> = {
  "sub-denis": [
    { caseId: "tc-rev-01", outcome: "pass", expected: "关键论断指向可解析来源", actual: "12/12 论断有引用", durationMs: 400, artifacts: ["review-memo.md"] },
    { caseId: "tc-rev-02", outcome: "pass", expected: "合同列出的子系统均被覆盖", actual: "控制环 / 传感 / 执行器均有专节", durationMs: 200, artifacts: ["review-memo.md"] },
    { caseId: "tc-rev-03", outcome: "pass", expected: "无未解释矛盾", actual: "1 处时序差异已在备忘解释", durationMs: 350, artifacts: ["review-memo.md"] },
    { caseId: "tc-rev-04", outcome: "pass", expected: "链接可解析且版本钉死。404 或 latest 未钉 = FAIL", actual: "4/4 HTTP 200，均钉 commit", durationMs: 1200, artifacts: ["source-check.json"] },
  ],
};

export const REVIEW_EVAL_SCRIPT: Record<
  string,
  { score: number; summary: string; dimensions: { name: string; score: number }[] }
> = {
  "sub-denis": {
    score: 88,
    summary: "风险清单可执行，来源已钉版本。相对最优，仍要过量表。不是语音沙箱。",
    dimensions: [
      { name: "引用", score: 90 },
      { name: "覆盖", score: 86 },
      { name: "矛盾", score: 84 },
      { name: "来源", score: 92 },
    ],
  },
};
