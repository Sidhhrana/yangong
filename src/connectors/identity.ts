/**
 * Identity is a connector. GitHub handle and Alipay account never live on Task / Award.
 * Person.id is the domain pointer. Rails bind outside the kernel.
 */

export type GitHubHandleCheck =
  | { ok: true; handle: string }
  | { ok: false; reason: "empty" | "crypto_wallet" | "not_github_handle" };

export type AlipayAccountCheck =
  | { ok: true; account: string; type: "phone" | "email" }
  | { ok: false; reason: "empty" | "crypto_wallet" | "trade_no" | "not_alipay_account" };

function isCrypto(raw: string) {
  return /^0x[0-9a-fA-F]{20,}$/.test(raw) || /^T[1-9A-HJ-NP-Za-km-z]{20,}$/.test(raw);
}

export function parseGitHubHandle(raw: string): GitHubHandleCheck {
  const handle = raw.trim().replace(/^@/, "");
  if (!handle) return { ok: false, reason: "empty" };
  if (isCrypto(handle) || /0x[0-9a-fA-F]{20,}/.test(handle)) {
    return { ok: false, reason: "crypto_wallet" };
  }
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(handle)) {
    return { ok: false, reason: "not_github_handle" };
  }
  return { ok: true, handle };
}

export function parseAlipayAccount(raw: string): AlipayAccountCheck {
  const account = raw.trim();
  if (!account) return { ok: false, reason: "empty" };
  if (isCrypto(account)) return { ok: false, reason: "crypto_wallet" };
  if (/^\d{16,32}$/.test(account)) return { ok: false, reason: "trade_no" };
  if (/^1[3-9]\d{9}$/.test(account)) return { ok: true, account, type: "phone" };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) return { ok: true, account, type: "email" };
  return { ok: false, reason: "not_alipay_account" };
}

export function identityReasonLabel(reason: string) {
  if (reason === "crypto_wallet") return "链上钱包不是 GitHub 身份，也不是支付宝账号。";
  if (reason === "trade_no") return "订单号是打款凭证，不是收款账号。";
  if (reason === "not_github_handle") return "GitHub handle 只允许字母数字和连字符。";
  if (reason === "not_alipay_account") return "支付宝账号只认大陆手机号或邮箱。";
  if (reason === "empty") return "不能空。";
  return reason;
}
