import type { CrmStore } from "../state/useCrmStore";
import { Panel } from "../components/Panel";
import { config } from "../config";
import { full, money, percent, stageBadgeClass, tierBadgeClass } from "../utils/format";
import { stageOf } from "../utils/selectors";
import { dueLabel } from "../utils/date";

export function ClientDetailScreen({ store }: { store: CrmStore }) {
  const { state, selectedClient: c, actions } = store;
  const currency = config.currency;
  const stage = stageOf(c.id, state.deals);
  const selTasks = state.tasks.filter((t) => t.client === c.id);

  const contactRows = [
    { label: "Email", value: c.email },
    { label: "Phone", value: c.phone },
    { label: "Location", value: c.city },
    { label: "Last review", value: c.review },
  ];
  const profileRows = [
    { label: "Objective", value: c.objective },
    { label: "Time horizon", value: c.horizon },
    { label: "Liquidity needs", value: c.liquidity },
    { label: "Risk tier", value: `${c.tier} (${c.risk}/10)` },
  ];
  const perfRows = [
    { label: "YTD", value: percent(c.ytd, currency), cls: "pos" },
    { label: "1 year", value: percent(c.yr1, currency), cls: "pos" },
    { label: "Net new · 12mo", value: money(c.contrib, currency), cls: "" },
  ];

  return (
    <div className="page">
      <button type="button" className="btn btn-ghost" style={{ alignSelf: "flex-start", minHeight: 44 }} onClick={() => actions.go("clients")}>
        ← All clients
      </button>

      <div className="detail-header">
        <span className="avatar avatar-lg">{c.name.slice(0, 2).toUpperCase()}</span>
        <div className="push">
          <h1 className="detail-name">{c.name}</h1>
          <div className="detail-sub">
            <span>{c.primary}</span><span>{c.city}</span><span>Client since {c.since}</span>
          </div>
        </div>
        <div className="detail-tags">
          <span className={tierBadgeClass(c.tier)}>{c.tier} · risk {c.risk}/10</span>
          <span className={stageBadgeClass(stage)}>{stage}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-col">
          <Panel title="Contact & household">
            <div className="contact-grid">
              {contactRows.map((r) => (
                <div key={r.label}>
                  <div className="field-label">{r.label}</div>
                  <div className="field-value">{r.value}</div>
                </div>
              ))}
            </div>
            <div className="members-list">
              {c.members.map((m) => (
                <div className="member-row" key={m.name}>
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                  <span className="text-muted">{m.role} · {m.age}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Risk tier & investment profile">
            <div className="risk-body">
              <div className="risk-dots">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={"risk-dot" + (i < c.risk ? " riskon" : "")} />
                ))}
              </div>
              <div className="risk-note">{c.riskNote}</div>
              {profileRows.map((r) => (
                <div className="profile-row" key={r.label}>
                  <span className="text-muted">{r.label}</span>
                  <span style={{ fontWeight: 600, textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Holdings">
            <div className="table-wrap">
              <table className="table" style={{ width: "100%", minWidth: 380 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Product</th>
                    <th style={{ textAlign: "left" }}>Account</th>
                    <th className="num">Value</th>
                    <th className="num">Alloc</th>
                  </tr>
                </thead>
                <tbody>
                  {c.holdings.map((h) => (
                    <tr key={h.account}>
                      <td style={{ fontWeight: 600 }}>{h.product}</td>
                      <td className="text-muted" style={{ fontSize: 12 }}>{h.account}</td>
                      <td className="num">{full(Math.round((c.value * h.pct) / 100), currency)}</td>
                      <td className="num">{h.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="detail-col">
          <div className="value-card">
            <div className="value-label">Total portfolio value</div>
            <div className="value-amount">{full(c.value, currency)}</div>
            <div className="perf-grid">
              {perfRows.map((p) => (
                <div key={p.label}>
                  <div className="field-label">{p.label}</div>
                  <div className={"perf-value" + (p.cls ? ` ${p.cls}` : "")}>{p.value}</div>
                </div>
              ))}
            </div>
          </div>

          <Panel title="Appointment history">
            {c.history.map((h, i) => (
              <div className="history-row" key={i}>
                <span className="history-date">{h.date}</span>
                <span>
                  <span className="history-type">{h.type}</span>
                  <span className="history-summary">{h.summary}</span>
                </span>
              </div>
            ))}
          </Panel>

          <Panel title="Follow-up notes & tasks">
            {selTasks.map((t) => (
              <div className="task-row" key={t.id}>
                <input
                  type="checkbox"
                  className="checkbox"
                  style={{ marginTop: 3 }}
                  checked={Boolean(t.done)}
                  onChange={() => actions.toggleTask(t.id)}
                  aria-label={`Mark "${t.title}" as done`}
                />
                <span style={{ flex: 1 }}>
                  <span className={"task-title" + (t.done ? " text-muted strike" : "")} style={{ display: "block" }}>{t.title}</span>
                  <span className="task-note">{t.note}</span>
                  <span className="task-tags">
                    <span className="badge b-neutral">{t.stage}</span>
                    <span className="badge b-info">Due {dueLabel(t.due).toLowerCase()}</span>
                  </span>
                </span>
              </div>
            ))}
            <div className="freeform-note"><span>{c.note}</span></div>
          </Panel>

          <Panel title="Activity timeline">
            <div className="timeline">
              {c.timeline.map((e, i) => (
                <div className="timeline-row" key={i}>
                  <span className="timeline-dot" />
                  <span>
                    <span className="timeline-text">{e.text}</span>
                    <span className="timeline-date">{e.date}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
