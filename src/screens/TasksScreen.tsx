import { STAGES } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { byId, openTasks } from "../utils/selectors";
import { stageTagClass } from "../utils/format";

export function TasksScreen({ store }: { store: CrmStore }) {
  const { state, actions } = store;
  const { tasks } = state;
  const filters = ["All", ...STAGES];
  const rows = tasks.filter((t) => state.filter === "All" || t.stage === state.filter);
  const overdueCount = tasks.filter((t) => t.overdue && !t.done).length;

  return (
    <div className="page">
      <div className="header-row">
        <div className="push">
          <div className="eyebrow">Follow-up tracker</div>
          <h1 className="page-title">{openTasks(tasks).length} open · {overdueCount} overdue</h1>
        </div>
        <div className="seg" style={{ flexWrap: "wrap" }}>
          {filters.map((f) => (
            <label className="seg-opt" style={{ minHeight: 44 }} key={f}>
              <input type="radio" name="stagefilter" checked={state.filter === f} onChange={() => actions.setFilter(f)} />
              <span>{f}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="panel">
        {rows.map((t) => (
          <div className="task-row-wide" key={t.id}>
            <button
              type="button"
              className={"task-checkbox lg" + (t.done ? " boxdone" : "")}
              onClick={() => actions.toggleTask(t.id)}
            >
              {t.done ? "✓" : ""}
            </button>
            <div className="task-col-main">
              <div className={"task-title" + (t.done ? " text-muted strike" : "")}>{t.title}</div>
              <div className="task-meta">{t.note}</div>
            </div>
            <button type="button" className="btn btn-ghost" style={{ flex: "0 0 auto", minHeight: 44 }} onClick={() => actions.openClient(t.client)}>
              {byId(t.client).name}
            </button>
            <div className="task-col-due">
              <div className={"due-date" + (t.overdue && !t.done ? " overdue" : "")}>{t.due}</div>
              <div className="text-muted">{t.priority} priority</div>
            </div>
            <div className="task-col-stage">
              <span className={stageTagClass(t.stage)}>{t.stage}</span>
              <button type="button" className="btn btn-secondary btn-icon" title="Advance stage" style={{ minHeight: 36 }} onClick={() => actions.advanceTask(t.id)}>
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
