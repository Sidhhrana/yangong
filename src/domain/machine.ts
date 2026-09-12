import type { Attempt, AttemptStatus, Dispute, Settlement, Slot, Task, TaskStatus } from "./types";

/**
 * Two machines.
 *
 * Task = market phase for the work item.
 * Attempt = one candidate's cycle on a Slot.
 *
 * Contest 默认三席：A 已提交测着、B 还在写、C 测失败。
 * 这时 Task 只能是 active / judging，不能再是 submitted 或 verifying。
 *
 * Winner ≠ Paid 挂在 Task（accepted → settling → closed）。
 * 拟中标 / 递补挂在 Attempt，Task 上只留 provisionalAttemptId 指针。
 */

export const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  draft: ["open", "cancelled"],
  open: ["active", "cancelled", "expired"],
  active: ["judging", "cancelled", "expired", "disputed"],
  judging: ["accepted", "rejected", "disputed", "cancelled"],
  accepted: ["settling", "disputed"],
  settling: ["closed", "disputed"],
  closed: [],
  rejected: ["open"],
  cancelled: [],
  disputed: ["judging", "cancelled", "rejected"],
  expired: [],
};

export const ATTEMPT_TRANSITIONS: Record<AttemptStatus, AttemptStatus[]> = {
  claimed: ["working", "withdrawn"],
  working: ["submitted", "withdrawn"],
  submitted: ["evaluating", "withdrawn"],
  evaluating: ["qualified", "disqualified", "withdrawn"],
  qualified: ["provisional", "verifying", "withdrawn"],
  disqualified: ["withdrawn"],
  provisional: ["verifying", "qualified", "withdrawn"],
  verifying: ["passed", "failed"],
  passed: ["stability", "failed"],
  failed: [],
  stability: ["accepted", "failed"],
  accepted: [],
  withdrawn: [],
};

const LIVE_ATTEMPT: AttemptStatus[] = [
  "working",
  "submitted",
  "evaluating",
  "verifying",
  "stability",
];

const POINTER_OK: AttemptStatus[] = ["provisional", "verifying", "passed", "stability"];

/** failed / withdrawn 释放席位，同一 Slot 可以开下一次 Attempt。 */
export const SLOT_RELEASED: AttemptStatus[] = ["failed", "withdrawn"];

export function canGoTask(from: TaskStatus, to: TaskStatus) {
  return TASK_TRANSITIONS[from].includes(to);
}

export function assertGoTask(from: TaskStatus, to: TaskStatus) {
  if (!canGoTask(from, to)) {
    throw new Error(`Illegal task transition ${from} → ${to}`);
  }
  return to;
}

export function canGoAttempt(from: AttemptStatus, to: AttemptStatus) {
  return ATTEMPT_TRANSITIONS[from].includes(to);
}

export function assertGoAttempt(from: AttemptStatus, to: AttemptStatus) {
  if (!canGoAttempt(from, to)) {
    throw new Error(`Illegal attempt transition ${from} → ${to}`);
  }
  return to;
}

/**
 * 跨机器不变量。单台迁移表管不了「三席同时不同步」这件事。
 * 协作模式允许 Task 仍是 active 时已有 Attempt.accepted（微奖，任务继续开）。
 */
export function checkTaskAttemptConsistency(
  task: Task,
  attempts: Attempt[],
  opts?: { slots?: Slot[]; settlements?: Settlement[]; disputes?: Dispute[] },
): { ok: boolean; violations: string[] } {
  const violations: string[] = [];
  const mine = attempts.filter((a) => a.taskId === task.id);

  const live = mine.filter((a) => LIVE_ATTEMPT.includes(a.status));
  if (live.length > 0 && task.status !== "active" && task.status !== "judging") {
    violations.push(
      `live attempts ${live.map((a) => a.status).join(",")} require Task active|judging, got ${task.status}`,
    );
  }

  if (task.status === "accepted") {
    const winners = mine.filter((a) => a.status === "accepted");
    if (winners.length !== 1) {
      violations.push(`Task accepted requires exactly one accepted Attempt, got ${winners.length}`);
    }
  }

  if (task.provisionalAttemptId) {
    const att = mine.find((a) => a.id === task.provisionalAttemptId);
    if (!att) {
      violations.push(`provisionalAttemptId ${task.provisionalAttemptId} not on this Task`);
    } else if (POINTER_OK.includes(att.status)) {
      // ok
    } else if (att.status === "failed" && task.status === "judging") {
      // 待递补
    } else {
      violations.push(`provisionalAttemptId points at Attempt ${att.status}`);
    }
  }

  if (task.status === "closed") {
    const paid = (opts?.settlements ?? []).filter((st) => st.status === "paid");
    if (paid.length === 0) {
      violations.push("Task closed requires a paid Settlement");
    }
  }

  if (task.status === "disputed") {
    const paid = (opts?.settlements ?? []).filter((st) => st.status === "paid");
    if (paid.length > 0) {
      violations.push("Task disputed cannot have a paid Settlement");
    }
    const open = (opts?.disputes ?? []).filter((d) => d.taskId === task.id && d.status === "open");
    if (open.length === 0) {
      violations.push("Task disputed requires an open Dispute object");
    }
  }

  if (task.status === "expired") {
    const liveOnExpired = mine.filter((a) => LIVE_ATTEMPT.includes(a.status));
    if (liveOnExpired.length > 0) {
      violations.push("expired Task cannot have live Attempts");
    }
  }

  if (opts?.slots) {
    const slotIds = opts.slots.filter((sl) => sl.taskId === task.id).map((sl) => sl.id);
    for (const slotId of slotIds) {
      const slot = opts.slots.find((sl) => sl.id === slotId);
      const liveOnSlot = mine.filter((a) => a.slotId === slotId && !SLOT_RELEASED.includes(a.status));
      if (liveOnSlot.length > 1) {
        violations.push(`slot ${slotId} has ${liveOnSlot.length} live Attempts`);
      }
      if (slot?.status === "applied" && liveOnSlot.length > 0) {
        violations.push(`applied slot ${slotId} cannot have an Attempt`);
      }
    }
  }

  return { ok: violations.length === 0, violations };
}

/** @deprecated Task-only alias. Prefer assertGoTask. */
export const TRANSITIONS = TASK_TRANSITIONS;
export const canGo = canGoTask;
export const assertGo = assertGoTask;
