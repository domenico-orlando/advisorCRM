import { CLIENTS, TIER_NAMES } from "../data/mock";
import type { Appointment, Client, Deal, Stage, Task } from "../types";
import { money } from "./format";
import { displayTime, shortDate, timeToMinutes, todayIso } from "./date";

export function totalAum(): number {
  return CLIENTS.reduce((a, c) => a + c.value, 0);
}

export function byId(id: string): Client {
  return CLIENTS.find((c) => c.id === id) ?? CLIENTS[0];
}

export function stageOf(clientId: string, deals: Deal[]): Stage | "—" {
  const d = deals.find((x) => x.client === clientId);
  return d ? d.stage : "—";
}

export function sortByStart(appts: Appointment[]): Appointment[] {
  return [...appts].sort(
    (p, q) => p.date.localeCompare(q.date) || timeToMinutes(p.time) - timeToMinutes(q.time),
  );
}

export function apptsOn(date: string, appts: Appointment[]): Appointment[] {
  return sortByStart(appts.filter((a) => a.date === date));
}

/** The client's next appointment from today onwards, as "12 Sep · 9:00". */
export function nextApptOf(clientId: string, appts: Appointment[]): string {
  const today = todayIso();
  const upcoming = sortByStart(appts.filter((a) => a.client === clientId && a.date >= today))[0];
  if (!upcoming) return "Unscheduled";
  return `${shortDate(upcoming.date)} · ${displayTime(upcoming.time)}`;
}

/** Open tasks whose due date has passed. */
export function isOverdue(task: Task): boolean {
  return !task.done && task.due < todayIso();
}

export interface TierBar {
  name: string;
  valueFmt: string;
  clients: number;
  pct: number;
}

export function tierBars(currency: string): TierBar[] {
  const aum = totalAum();
  return TIER_NAMES.map((n) => {
    const set = CLIENTS.filter((c) => c.tier === n);
    const v = set.reduce((a, c) => a + c.value, 0);
    return { name: n, valueFmt: money(v, currency), clients: set.length, pct: Math.round((v / aum) * 100) };
  });
}

export interface ProductRow {
  name: string;
  count: number;
  valueFmt: string;
  rawValue: number;
}

export function productCoverageRows(currency: string): ProductRow[] {
  const products: Record<string, { count: number; value: number }> = {};
  CLIENTS.forEach((cl) =>
    cl.holdings.forEach((h) => {
      const key = h.product.split(" — ")[0];
      if (!products[key]) products[key] = { count: 0, value: 0 };
      products[key].count += 1;
      products[key].value += Math.round((cl.value * h.pct) / 100);
    }),
  );
  return Object.keys(products)
    .map((k) => ({ name: k, count: products[k].count, valueFmt: money(products[k].value, currency), rawValue: products[k].value }))
    .sort((a, b) => b.rawValue - a.rawValue);
}

export function blendedYtd(): number {
  const aum = totalAum();
  return CLIENTS.reduce((a, cl) => a + cl.ytd * cl.value, 0) / aum;
}

export function productLine(client: Client): string {
  return client.holdings.map((h) => h.product.split(" — ")[0]).join(", ");
}

export function openTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.done);
}
