import type { TaskStatus } from "./types";

/**
 * V0.1 task status machine.
 *
 * Winner ≠ Paid. Provisional acceptance can fail verification;
 * the next-ranked candidate may be promoted.
 */
export const TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  draft: ["open", "cancelled"],
  open: ["claiming", "cancelled", "expired"],
  claiming: ["in_progress", "cancelled", "expired"],
  in_progress: ["submitted", "cancelled", "expired", "disputed"],
  submitted: ["evaluating", "cancelled", "disputed"],
  evaluating: ["provisional_accepted", "rejected", "disputed"],
  provisional_accepted: ["verifying", "evaluating", "rejected", "disputed"],
  verifying: ["stability_period", "evaluating", "rejected", "disputed"],
  stability_period: ["accepted", "evaluating", "disputed", "rejected"],
  accepted: ["payment_pending", "disputed"],
  payment_pending: ["paid", "disputed"],
  paid: [],
  rejected: ["open"],
  cancelled: [],
  disputed: ["evaluating", "cancelled", "rejected"],
  expired: [],
};

export function canGo(from: TaskStatus, to: TaskStatus) {
  return TRANSITIONS[from].includes(to);
}

export function assertGo(from: TaskStatus, to: TaskStatus) {
  if (!canGo(from, to)) {
    throw new Error(`Illegal transition ${from} → ${to}`);
  }
  return to;
}
