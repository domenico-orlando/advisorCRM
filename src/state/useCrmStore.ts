import { useCallback, useState } from "react";
import {
  CLIENTS, INITIAL_APPTS, INITIAL_DEALS, INITIAL_DISABLED_PRODUCTS, INITIAL_TASKS, STAGES,
} from "../data/mock";
import { config } from "../config";
import { addDays, addMonths, startOfWeek, todayIso } from "../utils/date";
import { buildConfirmationEmail, openEmailDraft, type EmailDraft } from "../utils/email";
import type { Appointment, AppointmentMode, CalMode, Deal, Screen, Stage, Task } from "../types";

export interface NewApptForm {
  client: string;
  date: string;
  time: string;
  durationMin: number;
  type: string;
  mode: AppointmentMode;
  sendEmail: boolean;
}

/** Shown after a booking so the advisor can see — and re-open — the email. */
export interface BookingConfirmation {
  appointmentId: string;
  clientName: string;
  date: string;
  time: string;
  draft: EmailDraft | null;
}

interface CrmState {
  screen: Screen | null;
  family: string;
  disabledProducts: string[];
  selected: string;
  calMode: CalMode;
  /** Anchor date the calendar is looking at; navigation moves this. */
  viewDate: string;
  filter: string;
  showNew: boolean;
  newAppt: NewApptForm;
  confirmation: BookingConfirmation | null;
  appts: Appointment[];
  tasks: Task[];
  deals: Deal[];
}

function blankForm(date: string): NewApptForm {
  return {
    client: CLIENTS[0].id,
    date,
    time: "09:00",
    durationMin: 45,
    type: "Portfolio review",
    mode: "Office",
    sendEmail: true,
  };
}

function initialState(): CrmState {
  const today = todayIso();
  return {
    screen: null,
    family: "All",
    disabledProducts: INITIAL_DISABLED_PRODUCTS,
    selected: "whitfield",
    calMode: "week",
    viewDate: today,
    filter: "All",
    showNew: false,
    newAppt: blankForm(today),
    confirmation: null,
    appts: INITIAL_APPTS,
    tasks: INITIAL_TASKS,
    deals: INITIAL_DEALS,
  };
}

function advanceStage(stage: Stage, dir: 1 | -1): Stage {
  const i = Math.max(0, Math.min(STAGES.indexOf(stage) + dir, STAGES.length - 1));
  return STAGES[i];
}

let apptSeq = 0;
let taskSeq = 0;

export function useCrmStore() {
  const [state, setState] = useState<CrmState>(initialState);

  const go = useCallback((screen: Screen) => {
    setState((s) => ({ ...s, screen }));
    window.scrollTo(0, 0);
  }, []);

  const openClient = useCallback((id: string) => {
    setState((s) => ({ ...s, screen: "client", selected: id }));
    window.scrollTo(0, 0);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done, stage: !t.done ? "Closed" : "Scheduled" } : t)),
    }));
  }, []);

  const advanceTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t;
        const stage = advanceStage(t.stage, 1);
        return { ...t, stage, done: stage === "Closed" };
      }),
    }));
  }, []);

  const moveDeal = useCallback((id: string, dir: 1 | -1) => {
    setState((s) => ({
      ...s,
      deals: s.deals.map((d) => (d.id === id ? { ...d, stage: advanceStage(d.stage, dir) } : d)),
    }));
  }, []);

  const setFamily = useCallback((family: string) => setState((s) => ({ ...s, family })), []);
  const setFilter = useCallback((filter: string) => setState((s) => ({ ...s, filter })), []);
  const setCalMode = useCallback((calMode: CalMode) => setState((s) => ({ ...s, calMode })), []);

  const toggleProductDisabled = useCallback((code: string) => {
    setState((s) => ({
      ...s,
      disabledProducts: s.disabledProducts.includes(code)
        ? s.disabledProducts.filter((x) => x !== code)
        : s.disabledProducts.concat([code]),
    }));
  }, []);

  /** Jump the calendar to a specific date (also used when a day cell is clicked). */
  const setViewDate = useCallback((viewDate: string) => setState((s) => ({ ...s, viewDate })), []);

  const goToToday = useCallback(() => setState((s) => ({ ...s, viewDate: todayIso() })), []);

  /** Steps by month, week or day depending on the mode currently shown. */
  const shiftView = useCallback((dir: 1 | -1) => {
    setState((s) => {
      const viewDate = s.calMode === "month"
        ? addMonths(s.viewDate, dir)
        : s.calMode === "week"
          ? addDays(s.viewDate, dir * 7)
          : addDays(s.viewDate, dir);
      return { ...s, viewDate };
    });
  }, []);

  /** Opens the booking dialog, optionally pre-filled for a clicked day or slot. */
  const openNew = useCallback((date?: string, time?: string) => {
    setState((s) => {
      const target = date ?? s.viewDate;
      return {
        ...s,
        showNew: true,
        confirmation: null,
        viewDate: target,
        newAppt: { ...blankForm(target), ...(time ? { time } : {}) },
      };
    });
  }, []);

  const closeNew = useCallback(() => setState((s) => ({ ...s, showNew: false })), []);

  const updateNewAppt = useCallback((patch: Partial<NewApptForm>) => {
    setState((s) => ({ ...s, newAppt: { ...s.newAppt, ...patch } }));
  }, []);

  const dismissConfirmation = useCallback(() => setState((s) => ({ ...s, confirmation: null })), []);

  /**
   * Books the appointment, auto-creates the follow-up task the prototype
   * always created, and — when asked — hands a confirmation email to the
   * advisor's own mail client.
   *
   * The appointment and the draft are built here rather than inside the state
   * updater: `mailto:` navigation only works while the click gesture is still
   * on the stack, and updaters run later (twice, under StrictMode).
   */
  const confirmNew = useCallback(() => {
    const form = state.newAppt;
    const client = CLIENTS.find((c) => c.id === form.client) ?? CLIENTS[0];
    apptSeq += 1;
    taskSeq += 1;

    const appt: Appointment = {
      id: `a-new-${apptSeq}`,
      client: form.client,
      date: form.date,
      time: form.time,
      durationMin: form.durationMin,
      type: form.type,
      mode: form.mode,
    };

    const draft = form.sendEmail ? buildConfirmationEmail(appt, client) : null;
    if (draft) {
      appt.confirmationEmailedAt = new Date().toISOString();
      openEmailDraft(draft);
    }

    const task: Task = {
      id: `t-new-${taskSeq}`,
      client: form.client,
      title: `Prepare agenda for ${form.type.toLowerCase()}`,
      note: "Auto-created when the appointment was booked.",
      due: form.date,
      priority: "Medium",
      stage: "Scheduled",
    };

    setState((s) => ({
      ...s,
      showNew: false,
      viewDate: appt.date,
      appts: s.appts.concat([appt]),
      tasks: [task].concat(s.tasks),
      confirmation: {
        appointmentId: appt.id,
        clientName: client.name,
        date: appt.date,
        time: appt.time,
        draft,
      },
    }));
  }, [state.newAppt]);

  /** Re-opens the confirmation draft for an appointment already on the book. */
  const emailAppointment = useCallback((apptId: string) => {
    const appt = state.appts.find((a) => a.id === apptId);
    if (!appt) return;
    const client = CLIENTS.find((c) => c.id === appt.client) ?? CLIENTS[0];
    const draft = buildConfirmationEmail(appt, client);
    openEmailDraft(draft);

    const emailedAt = new Date().toISOString();
    setState((s) => ({
      ...s,
      appts: s.appts.map((a) => (a.id === apptId ? { ...a, confirmationEmailedAt: emailedAt } : a)),
      confirmation: {
        appointmentId: appt.id,
        clientName: client.name,
        date: appt.date,
        time: appt.time,
        draft,
      },
    }));
  }, [state.appts]);

  const screen: Screen = state.screen ?? config.defaultScreen;
  const selectedClient = CLIENTS.find((c) => c.id === state.selected) ?? CLIENTS[0];
  const weekStart = startOfWeek(state.viewDate);

  return {
    state,
    screen,
    weekStart,
    selectedClient,
    actions: {
      go, openClient, toggleTask, advanceTask, moveDeal,
      setFamily, setFilter, setCalMode, toggleProductDisabled,
      setViewDate, goToToday, shiftView,
      openNew, closeNew, updateNewAppt, confirmNew, dismissConfirmation, emailAppointment,
    },
  };
}

export type CrmStore = ReturnType<typeof useCrmStore>;
