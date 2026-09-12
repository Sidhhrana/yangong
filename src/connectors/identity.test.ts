import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAlipayAccount, parseGitHubHandle } from "./identity.ts";

test("GitHub handle 去掉 @，拒绝钱包", () => {
  assert.deepEqual(parseGitHubHandle("@koukahuo-source"), { ok: true, handle: "koukahuo-source" });
  assert.equal(parseGitHubHandle("0x52513A733D4b52282F2b4f5A91D965D38b64f3BB").ok, false);
  assert.equal(parseGitHubHandle("not a handle").ok, false);
});

test("支付宝账号是手机或邮箱，不是钱包，也不是订单号", () => {
  assert.deepEqual(parseAlipayAccount("13800138000"), {
    ok: true,
    account: "13800138000",
    type: "phone",
  });
  assert.equal(parseAlipayAccount("pay@example.com").ok, true);
  assert.equal(parseAlipayAccount("0x52513A733D4b52282F2b4f5A91D965D38b64f3BB").ok, false);
  const trade = parseAlipayAccount("2026091212345678");
  assert.equal(trade.ok, false);
  if (!trade.ok) assert.equal(trade.reason, "trade_no");
});
