import type { Slot, SlotStatus, Task } from "./types.ts";

/** approval_required 必须经 applied。permissionless 可直接 filled。 */
export function slotStatusOnClaim(access: Task["access"]): SlotStatus {
  return access === "approval_required" ? "applied" : "filled";
}

export function canCreateAttempt(slot: Pick<Slot, "status">) {
  return slot.status === "filled";
}

export function canApprove(slot: Pick<Slot, "status">) {
  return slot.status === "applied";
}
