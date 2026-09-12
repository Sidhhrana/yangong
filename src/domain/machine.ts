import type { AttemptStatus, TaskStatus } from "./types";

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

/** @deprecated Task-only alias. Prefer assertGoTask. */
export const TRANSITIONS = TASK_TRANSITIONS;
export const canGo = canGoTask;
export const assertGo = assertGoTask;
