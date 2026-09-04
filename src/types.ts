export type Tier = "Conservative" | "Balanced" | "Growth" | "Aggressive";
export type Stage = "Scheduled" | "Completed" | "Follow-up sent" | "Closed";
export type Screen = "calendar" | "clients" | "client" | "tasks" | "pipeline" | "products" | "reports";
export type CalMode = "month" | "week" | "day";

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

export type AppointmentMode = "Office" | "Phone" | "Video";

export interface Appointment {
  id: string;
  client: string;
  /** Local calendar date, `YYYY-MM-DD`. */
  date: string;
  /** 24-hour `HH:MM`, so appointments sort chronologically. */
  time: string;
  durationMin: number;
  type: string;
  mode: AppointmentMode;
  /** Set once a confirmation email draft has been opened for this booking. */
  confirmationEmailedAt?: string;
}

export interface Task {
  id: string;
  client: string;
  title: string;
  note: string;
  /** Local calendar date, `YYYY-MM-DD`. "Overdue" is derived from it. */
  due: string;
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

export interface CrmConfig {
  advisorName: string;
  advisorEmail: string;
  firmName: string;
  defaultScreen: Screen;
  showSaturday: boolean;
  currency: "USD" | "EUR" | "GBP";
}
