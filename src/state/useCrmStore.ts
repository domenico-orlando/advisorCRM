import { useCallback, useState } from "react";
import {
  CLIENTS, DAYS, INITIAL_APPTS, INITIAL_DEALS, INITIAL_DISABLED_PRODUCTS, INITIAL_TASKS, STAGES,
} from "../data/mock";
import { config } from "../config";
import type { Appointment, CalMode, Deal, Screen, Stage, Task } from "../types";

interface CrmState {
  screen: Screen | null;
  family: string;
  disabledProducts: string[];
  selected: string;
  calMode: CalMode;
  dayIndex: number;
  filter: string;
  showNew: boolean;
  newClient: string;
  newDay: string;
  newTime: string;
  newType: string;
  appts: Appointment[];
  tasks: Task[];
  deals: Deal[];
}

function initialState(): CrmState {
  return {
    screen: null,
    family: "All",
    disabledProducts: INITIAL_DISABLED_PRODUCTS,
    selected: "whitfield",
    calMode: "week",
    dayIndex: 0,
    filter: "All",
    showNew: false,
    newClient: "whitfield",
    newDay: "0",
    newTime: "9:00",
    newType: "Portfolio review",
    appts: INITIAL_APPTS,
    tasks: INITIAL_TASKS,
    deals: INITIAL_DEALS,
  };
}

function advanceStage(stage: Stage, dir: 1 | -1): Stage {
  const i = Math.max(0, Math.min(STAGES.indexOf(stage) + dir, STAGES.length - 1));
  return STAGES[i];
}

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
  const setDayIndex = useCallback((dayIndex: number) => setState((s) => ({ ...s, dayIndex })), []);

  const toggleProductDisabled = useCallback((code: string) => {
    setState((s) => ({
      ...s,
      disabledProducts: s.disabledProducts.includes(code)
        ? s.disabledProducts.filter((x) => x !== code)
        : s.disabledProducts.concat([code]),
    }));
  }, []);

  const openNew = useCallback(() => setState((s) => ({ ...s, showNew: true })), []);
  const closeNew = useCallback(() => setState((s) => ({ ...s, showNew: false })), []);
  const setNewClient = useCallback((newClient: string) => setState((s) => ({ ...s, newClient })), []);
  const setNewDay = useCallback((newDay: string) => setState((s) => ({ ...s, newDay })), []);
  const setNewTime = useCallback((newTime: string) => setState((s) => ({ ...s, newTime })), []);
  const setNewType = useCallback((newType: string) => setState((s) => ({ ...s, newType })), []);

  const confirmNew = useCallback(() => {
    setState((s) => {
      const dayIdx = parseInt(s.newDay, 10);
      const apptId = "a" + (s.appts.length + 20);
      const newAppt: Appointment = {
        id: apptId, client: s.newClient, day: dayIdx, time: s.newTime, dur: "45 min", type: s.newType, mode: "Office",
      };
      const newTask: Task = {
        id: "t" + (s.tasks.length + 20),
        client: s.newClient,
        title: "Prepare agenda for " + s.newType.toLowerCase(),
        note: "Auto-created when the appointment was booked.",
        due: DAYS[dayIdx].date.replace("Aug ", "") + " Aug",
        overdue: false,
        priority: "Medium",
        stage: "Scheduled",
      };
      return {
        ...s,
        showNew: false,
        appts: s.appts.concat([newAppt]),
        tasks: [newTask].concat(s.tasks),
      };
    });
  }, []);

  const screen: Screen = state.screen ?? config.defaultScreen;
  const days = DAYS.slice(0, config.showSaturday ? 6 : 5);
  const selectedClient = CLIENTS.find((c) => c.id === state.selected) ?? CLIENTS[0];

  return {
    state,
    screen,
    days,
    selectedClient,
    actions: {
      go, openClient, toggleTask, advanceTask, moveDeal,
      setFamily, setFilter, setCalMode, setDayIndex, toggleProductDisabled,
      openNew, closeNew, setNewClient, setNewDay, setNewTime, setNewType, confirmNew,
    },
  };
}

export type CrmStore = ReturnType<typeof useCrmStore>;
