import type { Stage, Tier } from "../types";

const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || "$";
}

/** Compact form: $6.91M, $250k, $500 */
export function money(n: number, currency: string): string {
  const s = currencySymbol(currency);
  if (n >= 1000000) return s + (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return s + Math.round(n / 1000) + "k";
  return s + n;
}

/** Full form with thousands separators: $6,910,000 */
export function full(n: number, currency: string): string {
  return currencySymbol(currency) + n.toLocaleString("en-US");
}

export function tierTagClass(tier: Tier): string {
  return tier === "Aggressive" || tier === "Growth" ? "tag tag-accent" : "tag tag-neutral";
}

export function stageTagClass(stage: Stage | "—"): string {
  return stage === "Closed" ? "tag tag-neutral" : stage === "Follow-up sent" ? "tag tag-accent" : "tag tag-outline";
}

export function advisorInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}
