import assert from "node:assert/strict";
import { test } from "node:test";
import { validateAlipayTradeNo } from "./alipay.ts";

test("16 位数字是支付宝订单号", () => {
  const hit = validateAlipayTradeNo(" 2026091212345678 ");
  assert.equal(hit.ok, true);
  if (hit.ok) assert.equal(hit.tradeNo, "2026091212345678");
});

test("0x 钱包不是凭证", () => {
  const hit = validateAlipayTradeNo("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
  assert.equal(hit.ok, false);
  if (!hit.ok) assert.equal(hit.reason, "crypto_wallet");
});

test("空串和短数字都不是订单号", () => {
  assert.equal(validateAlipayTradeNo("").ok, false);
  assert.equal(validateAlipayTradeNo("12345").ok, false);
});
