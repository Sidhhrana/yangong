/**
 * Alipay is the only payout rail. Connector, not domain kernel.
 * Crypto wallets, WeChat, Stripe, PayPal are not proofs.
 */

export type AlipayProofCheck =
  | { ok: true; tradeNo: string }
  | { ok: false; reason: "empty" | "crypto_wallet" | "not_alipay_trade_no" };

export function validateAlipayTradeNo(raw: string): AlipayProofCheck {
  const tradeNo = raw.trim();
  if (!tradeNo) return { ok: false, reason: "empty" };
  if (/^0x[0-9a-fA-F]{20,}$/.test(tradeNo)) return { ok: false, reason: "crypto_wallet" };
  if (/^T[1-9A-HJ-NP-Za-km-z]{20,}$/.test(tradeNo)) return { ok: false, reason: "crypto_wallet" };
  if (!/^\d{16,32}$/.test(tradeNo)) return { ok: false, reason: "not_alipay_trade_no" };
  return { ok: true, tradeNo };
}

export function proofReasonLabel(reason: string) {
  if (reason === "empty") return "支付宝订单号不能空。合 PR 不算打款。";
  if (reason === "crypto_wallet") return "贴了链上钱包。不是支付宝订单号，也不是收款账号。";
  if (reason === "not_alipay_trade_no") return "只认 16–32 位数字的支付宝订单号。";
  return reason;
}
