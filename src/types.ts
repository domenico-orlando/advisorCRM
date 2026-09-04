export type Tier = "Conservative" | "Balanced" | "Growth" | "Aggressive";
export type Stage = "Scheduled" | "Completed" | "Follow-up sent" | "Closed";
export type Screen = "calendar" | "clients" | "client" | "tasks" | "pipeline" | "products" | "reports";
export type CalMode = "week" | "day";

export interface HouseholdMember {
  name: string;
  role: string;
  age: number;
}

export interface Holding {
  product: string;
  account: string;
  pct: number;
}

export interface HistoryEntry {
  date: string;
  type: string;
  summary: string;
}

export interface TimelineEntry {
  date: string;
  text: string;
}

export interface Client {
  id: string;
  name: string;
  primary: string;
  tier: Tier;
  risk: number;
  value: number;
  ytd: number;
  yr1: number;
  contrib: number;
  email: string;
  phone: string;
  city: string;
  since: number;
  objective: string;
  horizon: string;
  liquidity: string;
  review: string;
  lastReview: string;
  riskNote: string;
  members: HouseholdMember[];
  holdings: Holding[];
  history: HistoryEntry[];
  timeline: TimelineEntry[];
  note: string;
}

export interface Product {
  code: string;
  name: string;
  family: string;
  provider: string;
  min: number;
  fee: string;
  lo: number;
  hi: number;
  wrapper: string;
  approval: string;
}

export interface Appointment {
  id: string;
  client: string;
  day: number;
  time: string;
  dur: string;
  type: string;
  mode: "Office" | "Phone" | "Video";
}

export interface Task {
  id: string;
  client: string;
  title: string;
  note: string;
  due: string;
  overdue: boolean;
  priority: "High" | "Medium" | "Low";
  stage: Stage;
  done?: boolean;
}

export interface Deal {
  id: string;
  client: string;
  title: string;
  value: number;
  nextStep: string;
  stage: Stage;
}

export interface NextAction {
  client: string;
  code: string;
  reason: string;
  value: number;
}

export interface DayDef {
  dow: string;
  dayNum: string;
  label: string;
  date: string;
}

export interface CrmConfig {
  advisorName: string;
  defaultScreen: Screen;
  showSaturday: boolean;
  currency: "USD" | "EUR" | "GBP";
}
