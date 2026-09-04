import type { Stage, Tier } from "../types";

interface CurrencyStyle {
  locale: string;
  symbol: string;
  /** Italian convention puts a space between the symbol and the figure. */
  space: boolean;
}

const CURRENCIES: Record<string, CurrencyStyle> = {
  USD: { locale: "en-US", symbol: "$", space: false },
  EUR: { locale: "it-IT", symbol: "€", space: true },
  GBP: { locale: "en-GB", symbol: "£", space: false },
};

function styleFor(currency: string): CurrencyStyle {
  return CURRENCIES[currency] ?? CURRENCIES.USD;
}

export function currencySymbol(currency: string): string {
  return styleFor(currency).symbol;
}

function withSymbol(value: string, s: CurrencyStyle): string {
  return s.space ? `${s.symbol} ${value}` : `${s.symbol}${value}`;
}

function digits(n: number, locale: string, fraction = 0): string {
  return n.toLocaleString(locale, { minimumFractionDigits: fraction, maximumFractionDigits: fraction });
}

/** Compact form for KPIs and chart labels: $6.91M, $250k. */
export function money(n: number, currency: string): string {
  const s = styleFor(currency);
  if (n >= 1000000) return withSymbol(`${digits(n / 1000000, s.locale, 2)}M`, s);
  if (n >= 1000) return withSymbol(`${digits(Math.round(n / 1000), s.locale)}k`, s);
  return withSymbol(digits(n, s.locale), s);
}

/** Full form with grouping separators: $6,910,000 · € 6.910.000 */
export function full(n: number, currency: string): string {
  const s = styleFor(currency);
  return withSymbol(digits(n, s.locale), s);
}

/** Signed percentage in the active locale: +3.1% · +3,1% */
export function percent(n: number, currency: string, fraction = 1): string {
  const { locale } = styleFor(currency);
  const sign = n > 0 ? "+" : "";
  return `${sign}${digits(n, locale, fraction)}%`;
}

/**
 * Risk tier as a badge — rule 6 keeps status colour in badges and accent
 * edges only. Rising risk runs neutral → info → brand → caution.
 */
export function tierBadgeClass(tier: Tier): string {
  switch (tier) {
    case "Conservative": return "badge b-neutral";
    case "Balanced": return "badge b-info";
    case "Growth": return "badge b-brand";
    case "Aggressive": return "badge b-warn";
  }
}

export function stageBadgeClass(stage: Stage | "—"): string {
  switch (stage) {
    case "Scheduled": return "badge b-info";
    case "Completed": return "badge b-ok";
    case "Follow-up sent": return "badge b-brand";
    case "Closed": return "badge b-neutral";
    default: return "badge b-neutral badge-plain";
  }
}

export function advisorInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}
