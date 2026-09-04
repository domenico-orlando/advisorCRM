import { CLIENTS, TIER_NAMES } from "../data/mock";
import type { Appointment, Client, DayDef, Deal, Stage, Task } from "../types";
import { money } from "./format";

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

export function nextApptOf(clientId: string, appts: Appointment[], days: DayDef[]): string {
  const a = appts
    .filter((x) => x.client === clientId)
    .sort((p, q) => p.day - q.day || parseFloat(p.time) - parseFloat(q.time))[0];
  return a ? days[a.day].label + " · " + a.time : "Unscheduled";
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
