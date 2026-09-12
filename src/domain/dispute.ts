import type { Dispute, Task, TaskStatus } from "./types.ts";

export const DISPUTE_FROM: TaskStatus[] = ["judging", "accepted", "settling"];
export const DISPUTE_RESOLVE: TaskStatus[] = ["judging", "cancelled", "rejected"];

export function canOpenDispute(task: Pick<Task, "status">) {
  return DISPUTE_FROM.includes(task.status);
}

export function canResolveDispute(dispute: Pick<Dispute, "status">, to: TaskStatus) {
  return dispute.status === "open" && DISPUTE_RESOLVE.includes(to);
}

/** 争议中不能把 Settlement 标成 paid。 */
export function assertNotDisputed(task: Pick<Task, "status">) {
  if (task.status === "disputed") {
    throw new Error("cannot pay while disputed");
  }
}
