import { CLIENTS, WEEK_LABEL } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { Panel } from "../components/Panel";
import { config } from "../config";
import { money } from "../utils/format";
import { byId, openTasks, tierBars, totalAum } from "../utils/selectors";

export function CalendarScreen({ store }: { store: CrmStore }) {
  const { state, days, actions } = store;
  const { appts, tasks, deals } = state;
  const currency = config.currency;

  const dayList = appts
    .filter((a) => a.day === state.dayIndex)
    .sort((a, b) => parseFloat(a.time) - parseFloat(b.time));

  const open = openTasks(tasks);
  const dueToday = open.slice(0, 4);
  const bars = tierBars(currency);
  const pipelineOpen = deals.filter((d) => d.stage !== "Closed");

  const kpis = [
    { label: "Appointments this week", value: String(appts.length), sub: `${dayList.length} on ${days[state.dayIndex].label}` },
    { label: "Follow-ups open", value: String(open.length), sub: `${tasks.filter((t) => t.overdue && !t.done).length} overdue` },
    { label: "Assets under advice", value: money(totalAum(), currency), sub: `${CLIENTS.length} households` },
    { label: "Pipeline value", value: money(pipelineOpen.reduce((a, d) => a + d.value, 0), currency), sub: `${pipelineOpen.length} open opportunities` },
  ];

  return (
    <div className="page">
      <div className="header-row">
        <div className="push">
          <div className="eyebrow">Appointments</div>
          <h1 className="page-title">{WEEK_LABEL}</h1>
        </div>
        <div className="seg">
          <label className="seg-opt">
            <input type="radio" name="calmode" checked={state.calMode === "week"} onChange={() => actions.setCalMode("week")} />
            <span>Week</span>
          </label>
          <label className="seg-opt">
            <input type="radio" name="calmode" checked={state.calMode === "day"} onChange={() => actions.setCalMode("day")} />
            <span>Day</span>
          </label>
        </div>
        <button type="button" className="btn btn-primary" style={{ minHeight: 44 }} onClick={actions.openNew}>
          + New appointment
        </button>
      </div>

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
          {state.calMode === "week" ? (
            <div className="week-grid-wrap">
              <div className="week-grid">
                {days.map((d, i) => {
                  const list = appts
                    .filter((a) => a.day === i)
                    .sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
                  return (
                    <div className="week-day-col" key={d.dow}>
                      <div className="week-day-head">
                        <span className="week-day-dow">{d.dow}</span>
                        <span className="week-day-num">{d.dayNum}</span>
                      </div>
                      <div className="week-day-body">
                        {list.map((a) => {
                          const c = byId(a.client);
                          return (
                            <button type="button" className="appt-chip" key={a.id} onClick={() => actions.openClient(c.id)}>
                              <span className="appt-time">{a.time}</span>
                              <span className="appt-client">{c.name}</span>
                              <span className="appt-meta">{a.type} · {a.mode}</span>
                            </button>
                          );
                        })}
                        {list.length === 0 && <span className="empty-note">No appointments</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="day-agenda">
              <div className="day-tabs">
                {days.map((d, i) => (
                  <button
                    type="button"
                    key={d.label}
                    className={"day-tab" + (state.dayIndex === i ? " navactive" : "")}
                    onClick={() => actions.setDayIndex(i)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div>
                {dayList.map((a) => {
                  const c = byId(a.client);
                  const stage = deals.find((d) => d.client === c.id)?.stage ?? "Scheduled";
                  return (
                    <button type="button" className="day-appt-row" key={a.id} onClick={() => actions.openClient(c.id)}>
                      <span className="day-appt-time">{a.time}</span>
                      <span className="day-appt-info">
                        <span className="day-appt-client">{c.name}</span>
                        <span className="day-appt-meta">{a.type} · {a.mode} · {a.dur}</span>
                        <span className="day-appt-tags">
                          <span className="tag tag-outline">{c.tier}</span>
                          <span className="tag tag-accent">{stage}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
                {dayList.length === 0 && (
                  <div className="day-empty">Nothing booked. Two follow-up calls are unscheduled.</div>
                )}
              </div>
            </div>
          )}
        </section>

        <aside className="calendar-aside">
          <Panel title="Due today">
            {dueToday.map((t) => (
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
                  <span className="task-meta">{byId(t.client).name} · {t.stage}</span>
                </span>
              </div>
            ))}
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
