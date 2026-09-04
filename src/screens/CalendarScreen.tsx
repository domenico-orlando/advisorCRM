import { CLIENTS } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { Panel } from "../components/Panel";
import { MonthGrid } from "../components/MonthGrid";
import { BookingConfirmationBanner } from "../components/BookingConfirmationBanner";
import { config } from "../config";
import { money } from "../utils/format";
import { apptsOn, byId, isOverdue, openTasks, tierBars, totalAum } from "../utils/selectors";
import {
  addDays, dayNum, displayTime, dowShort, dueLabel, isToday, longDate,
  monthLabel, shortDate, todayIso, weekLabel,
} from "../utils/date";
import type { Appointment } from "../types";

/**
 * Mon–Fri as the design specifies, plus Saturday when configured — and plus
 * any weekend day that actually holds a booking, so nothing the advisor books
 * can end up invisible.
 */
function visibleWeekDates(weekStart: string, appts: Appointment[]): string[] {
  const booked = new Set(appts.map((a) => a.date));
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    .filter((date, i) => i < 5 || (i === 5 && config.showSaturday) || booked.has(date));
}

export function CalendarScreen({ store }: { store: CrmStore }) {
  const { state, weekStart, actions } = store;
  const { appts, tasks, deals, viewDate, calMode } = state;
  const currency = config.currency;
  const today = todayIso();

  const weekDates = visibleWeekDates(weekStart, appts);
  const dayList = apptsOn(viewDate, appts);
  const weekAppts = appts.filter((a) => a.date >= weekStart && a.date < addDays(weekStart, 7));
  const monthAppts = appts.filter((a) => a.date.slice(0, 7) === viewDate.slice(0, 7));

  const open = openTasks(tasks);
  const overdue = open.filter(isOverdue);
  // A genuine "what needs me now" rail: overdue first, then today's.
  const dueNow = [...overdue, ...open.filter((t) => t.due === today)].slice(0, 4);
  const bars = tierBars(currency);
  const pipelineOpen = deals.filter((d) => d.stage !== "Closed");

  const periodCount = calMode === "month" ? monthAppts.length : calMode === "day" ? dayList.length : weekAppts.length;
  const periodLabel = calMode === "month" ? "Appointments this month"
    : calMode === "day" ? "Appointments this day" : "Appointments this week";

  const kpis = [
    { label: periodLabel, value: String(periodCount), sub: `${dayList.length} on ${isToday(viewDate) ? "today" : shortDate(viewDate)}` },
    { label: "Follow-ups open", value: String(open.length), sub: `${overdue.length} overdue` },
    { label: "Assets under advice", value: money(totalAum(), currency), sub: `${CLIENTS.length} households` },
    { label: "Pipeline value", value: money(pipelineOpen.reduce((a, d) => a + d.value, 0), currency), sub: `${pipelineOpen.length} open opportunities` },
  ];

  const title = calMode === "month" ? monthLabel(viewDate)
    : calMode === "day" ? longDate(viewDate) : weekLabel(viewDate);

  return (
    <div className="page">
      <div className="header-row">
        <div className="push">
          <div className="eyebrow">Appointments</div>
          <h1 className="page-title">{title}</h1>
        </div>

        <div className="cal-nav">
          <button type="button" className="btn btn-secondary btn-icon" title="Previous" aria-label="Previous period" onClick={() => actions.shiftView(-1)}>←</button>
          <button type="button" className="btn btn-secondary" onClick={actions.goToToday}>Today</button>
          <button type="button" className="btn btn-secondary btn-icon" title="Next" aria-label="Next period" onClick={() => actions.shiftView(1)}>→</button>
        </div>

        <div className="seg">
          {(["month", "week", "day"] as const).map((mode) => (
            <label className="seg-opt" key={mode}>
              <input type="radio" name="calmode" checked={calMode === mode} onChange={() => actions.setCalMode(mode)} />
              <span>{mode[0].toUpperCase() + mode.slice(1)}</span>
            </label>
          ))}
        </div>

        <button type="button" className="btn btn-primary" style={{ minHeight: 44 }} onClick={() => actions.openNew()}>
          + New appointment
        </button>
      </div>

      {state.confirmation && (
        <BookingConfirmationBanner confirmation={state.confirmation} onDismiss={actions.dismissConfirmation} />
      )}

      <div className="kpi-strip">
        {kpis.map((k) => (
          <div className="kpi-cell" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="calendar-columns">
        <section className="calendar-main">
          {calMode === "month" && (
            <MonthGrid
              viewDate={viewDate}
              appts={appts}
              onPickDay={(date) => { actions.setViewDate(date); actions.setCalMode("day"); }}
              onOpenClient={actions.openClient}
              onBook={(date) => actions.openNew(date)}
            />
          )}

          {calMode === "week" && (
            <div className="week-grid-wrap">
              <div className="week-grid">
                {weekDates.map((date) => {
                  const list = apptsOn(date, appts);
                  return (
                    <div className={"week-day-col" + (isToday(date) ? " week-day-today" : "")} key={date}>
                      <div className="week-day-head">
                        <span className="week-day-dow">{dowShort(date)}</span>
                        <span className="week-day-num">{dayNum(date)}</span>
                      </div>
                      <div className="week-day-body">
                        {list.map((a) => (
                          <button type="button" className="appt-chip" key={a.id} onClick={() => actions.openClient(a.client)}>
                            <span className="appt-time">{displayTime(a.time)}</span>
                            <span className="appt-client">{byId(a.client).name}</span>
                            <span className="appt-meta">{a.type} · {a.mode}</span>
                          </button>
                        ))}
                        {list.length === 0 && <span className="empty-note">No appointments</span>}
                        <button
                          type="button"
                          className="day-add"
                          onClick={() => actions.openNew(date)}
                          title={`Book an appointment on ${longDate(date)}`}
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {calMode === "day" && (
            <div className="day-agenda">
              <div className="day-tabs">
                {weekDates.map((date) => (
                  <button
                    type="button"
                    key={date}
                    className={"day-tab" + (viewDate === date ? " navactive" : "")}
                    onClick={() => actions.setViewDate(date)}
                  >
                    {dowShort(date)} {dayNum(date)}
                  </button>
                ))}
              </div>
              <div>
                {dayList.map((a) => {
                  const c = byId(a.client);
                  const stage = deals.find((d) => d.client === c.id)?.stage ?? "Scheduled";
                  return (
                    <div className="day-appt-row" key={a.id}>
                      <button type="button" className="day-appt-open" onClick={() => actions.openClient(c.id)}>
                        <span className="day-appt-time">{displayTime(a.time)}</span>
                        <span className="day-appt-info">
                          <span className="day-appt-client">{c.name}</span>
                          <span className="day-appt-meta">{a.type} · {a.mode} · {a.durationMin} min</span>
                          <span className="day-appt-tags">
                            <span className="tag tag-outline">{c.tier}</span>
                            <span className="tag tag-accent">{stage}</span>
                            {a.confirmationEmailedAt && <span className="tag tag-neutral">✓ Confirmation emailed</span>}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary day-appt-email"
                        onClick={() => actions.emailAppointment(a.id)}
                        title={`Email a confirmation to ${c.email}`}
                      >
                        ✉ Email confirmation
                      </button>
                    </div>
                  );
                })}
                {dayList.length === 0 && (
                  <div className="day-empty">
                    <span>Nothing booked on {longDate(viewDate)}.</span>
                    <button type="button" className="btn btn-ghost" onClick={() => actions.openNew(viewDate)}>
                      Book this day →
                    </button>
                  </div>
                )}
                {dayList.length > 0 && (
                  <button type="button" className="day-add day-add-wide" onClick={() => actions.openNew(viewDate)}>
                    + Add an appointment on {shortDate(viewDate)}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <aside className="calendar-aside">
          <Panel title="Due today">
            {dueNow.map((t) => (
              <div className="task-row" key={t.id}>
                <button
                  type="button"
                  className={"task-checkbox" + (t.done ? " boxdone" : "")}
                  onClick={() => actions.toggleTask(t.id)}
                >
                  {t.done ? "✓" : ""}
                </button>
                <span className="task-copy">
                  <span className="task-title">{t.title}</span>
                  <span className="task-meta">
                    {byId(t.client).name} · {t.stage} ·{" "}
                    <span className={isOverdue(t) ? "overdue" : ""}>{dueLabel(t.due)}</span>
                  </span>
                </span>
              </div>
            ))}
            {dueNow.length === 0 && (
              <div className="empty-note" style={{ padding: "var(--space-3)" }}>Nothing due today.</div>
            )}
            <button type="button" className="btn btn-ghost" style={{ margin: "8px 12px", minHeight: 44 }} onClick={() => actions.go("tasks")}>
              All follow-ups →
            </button>
          </Panel>

          <Panel title="Book of business">
            {bars.map((b) => (
              <div className="bar-row" key={b.name}>
                <span className="bar-label-row">
                  <span style={{ fontWeight: 600 }}>{b.name}</span>
                  <span className="text-muted">{b.valueFmt}</span>
                </span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${b.pct}%` }} />
                </span>
              </div>
            ))}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
