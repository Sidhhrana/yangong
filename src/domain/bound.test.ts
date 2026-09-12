import assert from "node:assert/strict";
import { test } from "node:test";
import { judgeBound, parseBound } from "./bound.ts";

test("合同 P95 < 800ms：799 过，800 不过，801 不过", () => {
  const expected = "P95 < 800ms";
  assert.deepEqual(parseBound(expected), { metric: "P95", op: "<", threshold: 800, unit: "ms" });
  assert.equal(judgeBound(expected, "799ms"), "pass");
  assert.equal(judgeBound(expected, 800), "fail");
  assert.equal(judgeBound(expected, "801ms"), "fail");
});

test("Alice 920 / Bob 710 / Carol 1300 跟夹具一致", () => {
  const expected = "P95 < 800ms";
  assert.equal(judgeBound(expected, "920ms"), "fail");
  assert.equal(judgeBound(expected, "710ms"), "pass");
  assert.equal(judgeBound(expected, "1300ms"), "fail");
});

test("不是阈值的 expected 不装成 SLA", () => {
  assert.equal(parseBound("Wi-Fi 断开 3s 后 TTS 在 3s 内重连"), null);
  assert.equal(judgeBound("Wi-Fi 断开 3s 后 TTS 在 3s 内重连", "TTS 永久卡死"), null);
});
