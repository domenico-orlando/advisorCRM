import type { Appointment, Client, DayDef, Deal, NextAction, Product, Stage, Task } from "../types";

export const STAGES: Stage[] = ["Scheduled", "Completed", "Follow-up sent", "Closed"];

export const DAYS: DayDef[] = [
  { dow: "Mon", dayNum: "17", label: "Mon 17", date: "Aug 17" },
  { dow: "Tue", dayNum: "18", label: "Tue 18", date: "Aug 18" },
  { dow: "Wed", dayNum: "19", label: "Wed 19", date: "Aug 19" },
  { dow: "Thu", dayNum: "20", label: "Thu 20", date: "Aug 20" },
  { dow: "Fri", dayNum: "21", label: "Fri 21", date: "Aug 21" },
  { dow: "Sat", dayNum: "22", label: "Sat 22", date: "Aug 22" },
];

export const WEEK_LABEL = "Week of 17 August 2026";

export const CLIENTS: Client[] = [
  {
    id: "rivera", name: "Rivera Trust", primary: "Sofia Rivera", tier: "Conservative", risk: 3, value: 6910000, ytd: 3.1, yr1: 5.4, contrib: 60000,
    email: "s.rivera@riveratrust.com", phone: "(415) 220-8841", city: "San Francisco, CA", since: 2009,
    objective: "Capital preservation & income", horizon: "Perpetual (trust)", liquidity: "$250k annual distribution",
    review: "12 Jun 2026", lastReview: "12 Jun 2026",
    riskNote: "Tolerance verified at annual review. Drawdown ceiling 8%.",
    members: [{ name: "Sofia Rivera", role: "Grantor", age: 71 }, { name: "Elena Rivera-Mott", role: "Beneficiary", age: 44 }],
    holdings: [
      { product: "Municipal Bond Ladder", account: "Trust · 4402", pct: 52 },
      { product: "Managed Portfolio — Income", account: "Trust · 4403", pct: 33 },
      { product: "Fixed Annuity", account: "Ind · 8871", pct: 15 },
    ],
    history: [
      { date: "12 Jun", type: "Annual review", summary: "Reaffirmed income mandate; muni ladder extended to 9 years." },
      { date: "04 Mar", type: "Trust check-in", summary: "Beneficiary added to statements distribution." },
      { date: "18 Jan", type: "Tax planning", summary: "Coordinated with CPA on 2025 K-1 timing." },
    ],
    timeline: [
      { date: "17 Aug 2026", text: "Distribution schedule sent for signature" },
      { date: "02 Aug 2026", text: "Statement delivery preference changed to mail" },
      { date: "12 Jun 2026", text: "Annual review completed" },
      { date: "29 May 2026", text: "IPS updated — drawdown ceiling 8%" },
    ],
    note: "Prefers phone over email. Never call before 10am PT. Daughter Elena should be copied on all trust correspondence.",
  },
  {
    id: "lindqvist", name: "Lindqvist Household", primary: "Erik & Anna Lindqvist", tier: "Conservative", risk: 4, value: 5260000, ytd: 2.4, yr1: 4.8, contrib: 0,
    email: "erik.lindqvist@nordmail.com", phone: "(612) 774-2093", city: "Edina, MN", since: 2011,
    objective: "Retirement income, legacy to grandchildren", horizon: "10+ years", liquidity: "$18k monthly draw",
    review: "22 Apr 2026", lastReview: "22 Apr 2026",
    riskNote: "Both retired. Sequence-of-returns risk is the binding constraint.",
    members: [{ name: "Erik Lindqvist", role: "Primary", age: 68 }, { name: "Anna Lindqvist", role: "Spouse", age: 66 }],
    holdings: [
      { product: "Variable Annuity", account: "Jt · 2210", pct: 40 },
      { product: "Managed Portfolio — Balanced", account: "Jt · 2211", pct: 45 },
      { product: "Long-Term Care", account: "Policy · LTC-771", pct: 15 },
    ],
    history: [
      { date: "22 Apr", type: "Annual review", summary: "Withdrawal rate cut to 3.6% after healthcare cost update." },
      { date: "09 Feb", type: "Estate meeting", summary: "Attorney introduced; beneficiary designations refreshed." },
      { date: "14 Nov", type: "Portfolio review", summary: "Trimmed equity sleeve by 5%." },
    ],
    timeline: [
      { date: "18 Aug 2026", text: "Annuity income rider illustration requested" },
      { date: "30 Jul 2026", text: "RMD projection for 2027 shared" },
      { date: "22 Apr 2026", text: "Annual review completed" },
      { date: "09 Feb 2026", text: "Estate documents received" },
    ],
    note: "Anna makes the decisions on insurance; Erik on investments. Keep both in the room for any product change.",
  },
  {
    id: "whitfield", name: "Whitfield Household", primary: "Margaret & Alan Whitfield", tier: "Balanced", risk: 5, value: 4280000, ytd: 6.2, yr1: 9.4, contrib: 120000,
    email: "m.whitfield@grovemail.com", phone: "(203) 551-4470", city: "Greenwich, CT", since: 2014,
    objective: "Fund retirement at 62, then legacy", horizon: "8 years to retirement", liquidity: "$100k reserve",
    review: "31 Jul 2026", lastReview: "31 Jul 2026",
    riskNote: "Balanced mandate, 60/40 target with a 5% band.",
    members: [
      { name: "Margaret Whitfield", role: "Primary", age: 54 },
      { name: "Alan Whitfield", role: "Spouse", age: 57 },
      { name: "Colin Whitfield", role: "Dependent", age: 19 },
    ],
    holdings: [
      { product: "Managed Portfolio — Balanced", account: "Jt · 1180", pct: 58 },
      { product: "IRA Rollover", account: "IRA · 1181", pct: 31 },
      { product: "Term Life", account: "Policy · TL-334", pct: 11 },
    ],
    history: [
      { date: "31 Jul", type: "Rollover meeting", summary: "$860k 401(k) rollover agreed; paperwork out for signature." },
      { date: "12 Jun", type: "Mid-year review", summary: "On track; college funding gap flagged for Colin." },
      { date: "27 Feb", type: "Intro to tax advisor", summary: "Joint call with CPA on Roth conversion window." },
    ],
    timeline: [
      { date: "17 Aug 2026", text: "Rollover forms received — pending custodian" },
      { date: "31 Jul 2026", text: "Proposal presented" },
      { date: "12 Jun 2026", text: "Mid-year review completed" },
      { date: "27 Feb 2026", text: "CPA introduced" },
    ],
    note: "Margaret responds fastest by text. Wants a single-page summary before every meeting, not a deck.",
  },
  {
    id: "chen", name: "Chen Household", primary: "Wei & Lian Chen", tier: "Balanced", risk: 6, value: 3475000, ytd: 7.8, yr1: 11.2, contrib: 96000,
    email: "wei.chen@meridianeng.com", phone: "(206) 338-1129", city: "Bellevue, WA", since: 2017,
    objective: "Early retirement at 58, second property", horizon: "12 years", liquidity: "$400k for property in 2028",
    review: "05 May 2026", lastReview: "05 May 2026",
    riskNote: "Comfortable with volatility; concentrated employer stock is the real exposure.",
    members: [{ name: "Wei Chen", role: "Primary", age: 46 }, { name: "Lian Chen", role: "Spouse", age: 45 }],
    holdings: [
      { product: "401(k) Rollover", account: "IRA · 5520", pct: 46 },
      { product: "Managed Portfolio — Growth", account: "Jt · 5521", pct: 40 },
      { product: "Disability Income", account: "Policy · DI-902", pct: 14 },
    ],
    history: [
      { date: "05 May", type: "Annual review", summary: "Employer stock now 22% of net worth; diversification plan drafted." },
      { date: "11 Mar", type: "Cash flow call", summary: "Property down payment moved to short-duration sleeve." },
      { date: "20 Dec", type: "Year-end", summary: "Tax-loss harvest executed." },
    ],
    timeline: [
      { date: "19 Aug 2026", text: "10b5-1 sale schedule to review" },
      { date: "01 Aug 2026", text: "Concentration analysis sent" },
      { date: "05 May 2026", text: "Annual review completed" },
      { date: "11 Mar 2026", text: "Cash flow plan updated" },
    ],
    note: "Both engineers; they read the underlying holdings. Send data, not narrative.",
  },
  {
    id: "okonkwo", name: "Okonkwo Family", primary: "Daniel & Adaeze Okonkwo", tier: "Growth", risk: 7, value: 2140000, ytd: 11.4, yr1: 15.6, contrib: 144000,
    email: "adaeze.o@okonkwomd.com", phone: "(713) 902-6647", city: "Houston, TX", since: 2019,
    objective: "Education funding and practice sale in 15 years", horizon: "15 years", liquidity: "$150k practice reserve",
    review: "18 Mar 2026", lastReview: "18 Mar 2026",
    riskNote: "High income, long horizon. Growth mandate with insurance floor.",
    members: [
      { name: "Adaeze Okonkwo", role: "Primary", age: 41 },
      { name: "Daniel Okonkwo", role: "Spouse", age: 43 },
      { name: "Nkem Okonkwo", role: "Dependent", age: 12 },
      { name: "Chidi Okonkwo", role: "Dependent", age: 9 },
    ],
    holdings: [
      { product: "Brokerage — Growth", account: "Jt · 7730", pct: 54 },
      { product: "529 Plan (×2)", account: "529 · 7731/2", pct: 33 },
      { product: "Umbrella Liability", account: "Policy · UL-118", pct: 13 },
    ],
    history: [
      { date: "18 Mar", type: "Annual review", summary: "529 contributions raised to state max for both children." },
      { date: "07 Jan", type: "Practice planning", summary: "Buy-sell agreement gap identified." },
      { date: "15 Oct", type: "Insurance audit", summary: "Umbrella raised to $5M." },
    ],
    timeline: [
      { date: "20 Aug 2026", text: "Buy-sell funding options meeting" },
      { date: "28 Jul 2026", text: "529 statements delivered" },
      { date: "18 Mar 2026", text: "Annual review completed" },
      { date: "15 Oct 2025", text: "Umbrella coverage increased" },
    ],
    note: "Adaeze schedules through her practice manager. Evening slots only after 6pm CT.",
  },
  {
    id: "baptiste", name: "Baptiste", primary: "Marcus Baptiste", tier: "Growth", risk: 7, value: 890000, ytd: 9.3, yr1: 13.1, contrib: 42000,
    email: "marcus@baptistestudio.co", phone: "(504) 118-7702", city: "New Orleans, LA", since: 2022,
    objective: "Build first $2M, buy studio space", horizon: "20 years", liquidity: "6-month business reserve",
    review: "26 Feb 2026", lastReview: "26 Feb 2026",
    riskNote: "Self-employed; income variability matters more than market risk.",
    members: [{ name: "Marcus Baptiste", role: "Primary", age: 36 }],
    holdings: [
      { product: "Roth IRA", account: "Roth · 9910", pct: 34 },
      { product: "Brokerage — Growth", account: "Ind · 9911", pct: 52 },
      { product: "SEP IRA", account: "SEP · 9912", pct: 14 },
    ],
    history: [
      { date: "26 Feb", type: "Annual review", summary: "SEP opened; 2025 contribution maxed before filing." },
      { date: "12 Sep", type: "Onboarding follow-up", summary: "Emergency fund target set at $48k." },
    ],
    timeline: [
      { date: "21 Aug 2026", text: "Quarterly check-in scheduled" },
      { date: "26 Feb 2026", text: "Annual review completed" },
      { date: "12 Sep 2025", text: "Reserve target agreed" },
      { date: "04 Apr 2022", text: "Household onboarded" },
    ],
    note: "Youngest household in the book. Referral source: Okonkwo. Good candidate for insurance review.",
  },
  {
    id: "petrova", name: "Petrova", primary: "Irina Petrova", tier: "Aggressive", risk: 9, value: 1320000, ytd: 18.7, yr1: 24.3, contrib: 60000,
    email: "irina@petrova.vc", phone: "(917) 442-3318", city: "Brooklyn, NY", since: 2021,
    objective: "Maximum growth, comfortable with drawdown", horizon: "25 years", liquidity: "None required",
    review: "14 Jan 2026", lastReview: "14 Jan 2026",
    riskNote: "Signed acknowledgement of 40% drawdown scenario. Reviews quarterly.",
    members: [{ name: "Irina Petrova", role: "Primary", age: 34 }],
    holdings: [
      { product: "Brokerage — Aggressive", account: "Ind · 3310", pct: 72 },
      { product: "Options Overlay", account: "Ind · 3311", pct: 18 },
      { product: "Cash Sweep", account: "Ind · 3312", pct: 10 },
    ],
    history: [
      { date: "14 Jan", type: "Annual review", summary: "Overlay mandate renewed; position limits unchanged." },
      { date: "03 Oct", type: "Quarterly call", summary: "Discussed private placement interest — suitability pending." },
    ],
    timeline: [
      { date: "18 Aug 2026", text: "Private placement suitability documents outstanding" },
      { date: "14 Jan 2026", text: "Annual review completed" },
      { date: "03 Oct 2025", text: "Quarterly call" },
      { date: "22 Jun 2021", text: "Household onboarded" },
    ],
    note: "Wants the risk, not the hand-holding. Short emails, decisions same-day.",
  },
];

export const PRODUCTS: Product[] = [
  { code: "MP-INC", name: "Managed Portfolio — Income", family: "Discretionary", provider: "Meridian Asset Mgmt", min: 250000, fee: "0.65%", lo: 1, hi: 4, wrapper: "SMA · Fee-based", approval: "Standard" },
  { code: "MP-BAL", name: "Managed Portfolio — Balanced", family: "Discretionary", provider: "Meridian Asset Mgmt", min: 250000, fee: "0.75%", lo: 3, hi: 7, wrapper: "SMA · Fee-based", approval: "Standard" },
  { code: "MP-GRW", name: "Managed Portfolio — Growth", family: "Discretionary", provider: "Meridian Asset Mgmt", min: 250000, fee: "0.85%", lo: 5, hi: 9, wrapper: "SMA · Fee-based", approval: "Standard" },
  { code: "MUNI-L", name: "Municipal Bond Ladder", family: "Fixed income", provider: "Meridian Fixed Income", min: 500000, fee: "0.35%", lo: 1, hi: 4, wrapper: "Direct bonds", approval: "Standard" },
  { code: "ANN-FIX", name: "Fixed Annuity", family: "Insurance", provider: "Northbank Life", min: 100000, fee: "1.10% M&E", lo: 1, hi: 4, wrapper: "Deferred contract", approval: "Suitability form" },
  { code: "ANN-VAR", name: "Variable Annuity + income rider", family: "Insurance", provider: "Northbank Life", min: 150000, fee: "1.85% all-in", lo: 3, hi: 7, wrapper: "Deferred contract", approval: "Suitability + supervisor" },
  { code: "LTC-01", name: "Long-Term Care", family: "Insurance", provider: "Cardinal Mutual", min: 0, fee: "Premium-based", lo: 1, hi: 10, wrapper: "Policy", approval: "Medical underwriting" },
  { code: "DI-OWN", name: "Own-Occupation Disability", family: "Insurance", provider: "Cardinal Mutual", min: 0, fee: "Premium-based", lo: 1, hi: 10, wrapper: "Policy", approval: "Medical underwriting" },
  { code: "TL-20", name: "Term Life — 20 year", family: "Insurance", provider: "Cardinal Mutual", min: 0, fee: "Premium-based", lo: 1, hi: 10, wrapper: "Policy", approval: "Medical underwriting" },
  { code: "529-ADV", name: "529 Plan — Advisor share", family: "Education", provider: "State Trust 529", min: 5000, fee: "0.45%", lo: 2, hi: 8, wrapper: "Class A / C", approval: "Standard" },
  { code: "IRA-RO", name: "IRA Rollover", family: "Retirement", provider: "Meridian Custody", min: 0, fee: "Platform 0.15%", lo: 1, hi: 10, wrapper: "Traditional / Roth", approval: "Rollover disclosure" },
  { code: "SEP-IRA", name: "SEP IRA", family: "Retirement", provider: "Meridian Custody", min: 0, fee: "Platform 0.15%", lo: 1, hi: 10, wrapper: "Employer plan", approval: "Standard" },
  { code: "OPT-OVL", name: "Options Overlay", family: "Alternatives", provider: "Halden Derivatives", min: 750000, fee: "1.25% + 10%", lo: 8, hi: 10, wrapper: "Managed overlay", approval: "Accredited + supervisor" },
  { code: "PP-VII", name: "Private Placement VII", family: "Alternatives", provider: "Halden Private", min: 250000, fee: "2.00% + 20%", lo: 8, hi: 10, wrapper: "Reg D 506(c)", approval: "Accredited + committee" },
];

export const NEXT_ACTIONS: NextAction[] = [
  { client: "baptiste", code: "DI-OWN", reason: "Self-employed, no income protection on file", value: 46000 },
  { client: "whitfield", code: "529-ADV", reason: "Education funding gap flagged for dependent, age 19", value: 90000 },
  { client: "chen", code: "MP-BAL", reason: "Employer stock at 22% of net worth — diversification sleeve", value: 640000 },
  { client: "okonkwo", code: "TL-20", reason: "Buy-sell agreement unfunded", value: 320000 },
];

export const INITIAL_APPTS: Appointment[] = [
  { id: "a1", client: "whitfield", day: 0, time: "9:00", dur: "60 min", type: "Rollover signing", mode: "Office" },
  { id: "a2", client: "rivera", day: 0, time: "11:30", dur: "45 min", type: "Trust distribution", mode: "Phone" },
  { id: "a3", client: "baptiste", day: 0, time: "16:00", dur: "30 min", type: "Quarterly check-in", mode: "Video" },
  { id: "a4", client: "lindqvist", day: 1, time: "10:00", dur: "60 min", type: "Income rider review", mode: "Office" },
  { id: "a5", client: "petrova", day: 1, time: "14:00", dur: "30 min", type: "Suitability review", mode: "Video" },
  { id: "a6", client: "chen", day: 2, time: "9:30", dur: "60 min", type: "Concentration plan", mode: "Video" },
  { id: "a7", client: "whitfield", day: 2, time: "15:00", dur: "30 min", type: "Custodian follow-up", mode: "Phone" },
  { id: "a8", client: "okonkwo", day: 3, time: "18:30", dur: "60 min", type: "Buy-sell funding", mode: "Office" },
  { id: "a9", client: "rivera", day: 4, time: "10:30", dur: "45 min", type: "CPA joint call", mode: "Phone" },
  { id: "a10", client: "baptiste", day: 4, time: "13:00", dur: "30 min", type: "Insurance intro", mode: "Video" },
];

export const INITIAL_TASKS: Task[] = [
  { id: "t1", client: "whitfield", title: "Chase custodian on $860k rollover transfer", note: "Forms received 17 Aug. Custodian SLA is 3 business days.", due: "18 Aug", overdue: false, priority: "High", stage: "Follow-up sent" },
  { id: "t2", client: "rivera", title: "Send distribution schedule for signature", note: "Copy Elena Rivera-Mott per household preference.", due: "17 Aug", overdue: false, priority: "High", stage: "Scheduled" },
  { id: "t3", client: "petrova", title: "Collect private placement suitability documents", note: "Second request. Cannot proceed without signed acknowledgement.", due: "14 Aug", overdue: true, priority: "High", stage: "Follow-up sent" },
  { id: "t4", client: "chen", title: "Draft 10b5-1 sale schedule with counsel", note: "Employer stock at 22% of net worth.", due: "19 Aug", overdue: false, priority: "Medium", stage: "Scheduled" },
  { id: "t5", client: "lindqvist", title: "Order annuity income rider illustration", note: "Anna decides on insurance — send both copies.", due: "18 Aug", overdue: false, priority: "Medium", stage: "Scheduled" },
  { id: "t6", client: "okonkwo", title: "Prepare buy-sell funding comparison", note: "Three funding structures, one page each.", due: "20 Aug", overdue: false, priority: "Medium", stage: "Scheduled" },
  { id: "t7", client: "baptiste", title: "Send disability quote from carrier", note: "Self-employed; own-occupation definition required.", due: "13 Aug", overdue: true, priority: "Low", stage: "Follow-up sent" },
  { id: "t8", client: "chen", title: "Confirm short-duration sleeve for 2028 down payment", note: "Reviewed at Mar call; verify balance drift.", due: "21 Aug", overdue: false, priority: "Low", stage: "Completed" },
  { id: "t9", client: "okonkwo", title: "File 529 contribution confirmations", note: "State max reached for both children.", due: "12 Aug", overdue: false, priority: "Low", stage: "Closed", done: true },
  { id: "t10", client: "lindqvist", title: "Log estate document receipt in CRM", note: "Attorney copies scanned and filed.", due: "10 Aug", overdue: false, priority: "Low", stage: "Closed", done: true },
];

export const INITIAL_DEALS: Deal[] = [
  { id: "d1", client: "whitfield", title: "401(k) rollover — $860k", value: 860000, nextStep: "Custodian confirmation", stage: "Follow-up sent" },
  { id: "d2", client: "chen", title: "Diversification mandate on employer stock", value: 640000, nextStep: "10b5-1 schedule with counsel", stage: "Scheduled" },
  { id: "d3", client: "okonkwo", title: "Buy-sell funding via permanent life", value: 320000, nextStep: "Present three structures", stage: "Scheduled" },
  { id: "d4", client: "petrova", title: "Private placement allocation", value: 250000, nextStep: "Suitability documents", stage: "Follow-up sent" },
  { id: "d5", client: "lindqvist", title: "Income rider add-on", value: 180000, nextStep: "Illustration review with Anna", stage: "Completed" },
  { id: "d6", client: "baptiste", title: "Own-occupation disability policy", value: 46000, nextStep: "Carrier quote", stage: "Follow-up sent" },
  { id: "d7", client: "rivera", title: "Muni ladder extension", value: 400000, nextStep: "Signed distribution schedule", stage: "Closed" },
];

export const INITIAL_DISABLED_PRODUCTS = ["PP-VII"];

export const TIME_OPTIONS = ["9:00", "10:00", "11:30", "13:00", "14:30", "16:00"];
export const TYPE_OPTIONS = ["Portfolio review", "Annual review", "Follow-up call", "Insurance review", "Onboarding"];
export const TIER_NAMES: Client["tier"][] = ["Conservative", "Balanced", "Growth", "Aggressive"];
export const TIER_RISK: Record<string, number> = { Conservative: 3, Balanced: 6, Growth: 7, Aggressive: 9 };
