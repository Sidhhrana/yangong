import { create } from 'zustand';
import { produce } from 'immer';
import type { Task } from '../data/types';

interface Award {
  base: number;
  qualityBonus: number;
  upstreamBonus: number;
  total: number;
}

interface Settlement {
  amount: number;
  paid: boolean;
}

interface YangongState {
  tasks: Record<string, Task>;
  awards: Record<string, Award>;
  settlements: Record<string, Settlement>;
  finalAccept: (taskId: string) => void;
  // other actions omitted for brevity
}

export const useYangong = create<YangongState>((set, get) => ({
  tasks: {},
  awards: {},
  settlements: {},
  finalAccept: (taskId: string) => {
    const task = get().tasks[taskId];
    if (!task) return;

    // Use the contract's reward pool instead of hard‑coded values.
    const pool = task.contract?.reward?.pool ?? 0;
    const award: Award = {
      base: pool,
      qualityBonus: 0,
      upstreamBonus: 0,
      total: pool,
    };

    set(
      produce((state: YangongState) => {
        state.awards[taskId] = award;
        // Settlement amount must match the award total.
        state.settlements[taskId] = { amount: award.total, paid: false };
      })
    );
  },
  // other actions remain unchanged
}));