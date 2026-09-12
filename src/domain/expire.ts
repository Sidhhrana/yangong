import type { Task, TaskStatus } from "./types.ts";

/** 只有市场还在找人 / 有人在做时，截止才有资格让 Task 过期。 */
export const EXPIREABLE: TaskStatus[] = ["open", "active"];

/**
 * 已验收 / 待支付不能因原截止日过期，否则 Winner ≠ Paid 崩了。
 * judging 带拟中标：走完验证，不要直接 expired。
 */
export function shouldExpire(task: Pick<Task, "status" | "deadline">, now: Date | string) {
  if (!EXPIREABLE.includes(task.status)) return false;
  return new Date(task.deadline).getTime() <= new Date(now).getTime();
}
