/** 合同阈值写在 TestCase.expected 上，例如 `P95 < 800ms`。不是 Verification 旁路。 */

export type BoundOp = "<" | "<=" | ">" | ">=";

export type Bound = {
  metric: string;
  op: BoundOp;
  threshold: number;
  unit: string;
};

const BOUND = /^([A-Za-z][A-Za-z0-9_]*)\s*(<=|>=|<|>)\s*(\d+(?:\.\d+)?)\s*(ms|s|%)?$/;

export function parseBound(expected: string): Bound | null {
  const m = BOUND.exec(expected.trim());
  if (!m) return null;
  return {
    metric: m[1],
    op: m[2] as BoundOp,
    threshold: Number(m[3]),
    unit: m[4] ?? "",
  };
}

export function compareBound(actual: number, bound: Bound): "pass" | "fail" {
  const { op, threshold } = bound;
  if (op === "<") return actual < threshold ? "pass" : "fail";
  if (op === "<=") return actual <= threshold ? "pass" : "fail";
  if (op === ">") return actual > threshold ? "pass" : "fail";
  return actual >= threshold ? "pass" : "fail";
}

/** `920ms` / `1.1s` → 毫秒。解析不了就返回 null。 */
export function parseDurationMs(actual: string): number | null {
  const m = /^(\d+(?:\.\d+)?)\s*(ms|s)$/i.exec(actual.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return m[2].toLowerCase() === "s" ? n * 1000 : n;
}

/** 用用例的 expected 判 actual。不是阈值就返回 null，交给别的判定。 */
export function judgeBound(expected: string, actual: string | number): "pass" | "fail" | null {
  const bound = parseBound(expected);
  if (!bound) return null;
  const value = typeof actual === "number" ? actual : parseDurationMs(actual);
  if (value == null) return null;
  return compareBound(value, bound);
}
