import { STAGES } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { byId, isOverdue, openTasks } from "../utils/selectors";
import { dueLabel } from "../utils/date";
import { stageBadgeClass } from "../utils/format";

export function TasksScreen({ store }: { store: CrmStore }) {
  const { state, actions } = store;
  const { tasks } = state;
  const filters = ["All", ...STAGES];
  const rows = tasks.filter((t) => state.filter === "All" || t.stage === state.filter);
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <div className="page">
      <div className="header-row">
        <div className="push">
          <div className="eyebrow">Follow-up tracker</div>
          <h1 className="page-title">{openTasks(tasks).length} open · {overdueCount} overdue</h1>
        </div>
        <div className="chip-row" role="group" aria-label="Filter by stage">
          {filters.map((f) => (
            <button
              type="button"
              key={f}
              className={"chip-btn" + (state.filter === f ? " chip-btn-on" : "")}
              aria-pressed={state.filter === f}
              onClick={() => actions.setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        {rows.map((t) => (
          <div className="task-row-wide" key={t.id}>
            <input
              type="checkbox"
              className="checkbox"
              style={{ marginTop: 3 }}
              checked={Boolean(t.done)}
              onChange={() => actions.toggleTask(t.id)}
              aria-label={`Mark "${t.title}" as done`}
            />
            <div className="task-col-main">
              <div className={"task-title" + (t.done ? " text-muted strike" : "")}>{t.title}</div>
              <div className="task-meta">{t.note}</div>
            </div>
            <button type="button" className="btn btn-ghost" style={{ flex: "0 0 auto", minHeight: 44 }} onClick={() => actions.openClient(t.client)}>
              {byId(t.client).name}
            </button>
            <div className="task-col-due">
              <div className={"due-date" + (isOverdue(t) ? " overdue" : "")}>{dueLabel(t.due)}</div>
              <div className="text-muted">{t.priority} priority</div>
            </div>
            <div className="task-col-stage">
              <span className={stageBadgeClass(t.stage)}>{t.stage}</span>
              <button type="button" className="btn btn-secondary btn-icon" title="Advance stage" aria-label="Advance stage" onClick={() => actions.advanceTask(t.id)}>
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
