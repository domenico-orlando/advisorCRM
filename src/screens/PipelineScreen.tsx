import { STAGES } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { config } from "../config";
import { full, money } from "../utils/format";
import { byId } from "../utils/selectors";

export function PipelineScreen({ store }: { store: CrmStore }) {
  const { state, actions } = store;
  const { deals } = state;
  const currency = config.currency;
  const total = deals.reduce((a, d) => a + d.value, 0);

  return (
    <div className="page">
      <div>
        <div className="eyebrow">Pipeline</div>
        <h1 className="page-title">{money(total, currency)} in play across {deals.length} opportunities</h1>
      </div>

      <div className="pipeline-board">
        {STAGES.map((stage) => {
          const set = deals.filter((d) => d.stage === stage);
          const sum = set.reduce((a, d) => a + d.value, 0);
          return (
            <section className="pipeline-col" key={stage}>
              <div className="pipeline-col-head">
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{stage}</div>
                <div className="pipeline-col-sum">
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20 }}>{money(sum, currency)}</span>
                  <span className="text-muted" style={{ fontSize: 12 }}>{set.length} deals</span>
                </div>
              </div>
              <div className="pipeline-col-body">
                {set.map((d) => {
                  const c = byId(d.client);
                  return (
                    <div className="deal-card" key={d.id}>
                      <button type="button" className="deal-client-btn" onClick={() => actions.openClient(c.id)}>{c.name}</button>
                      <span className="deal-title">{d.title}</span>
                      <span className="deal-next">Next: {d.nextStep}</span>
                      <span className="deal-foot">
                        <span className="deal-value">{full(d.value, currency)}</span>
                        <span className="deal-controls">
                          <button type="button" className="btn btn-secondary btn-icon" title="Back a stage" onClick={() => actions.moveDeal(d.id, -1)}>←</button>
                          <button type="button" className="btn btn-secondary btn-icon" title="Advance a stage" onClick={() => actions.moveDeal(d.id, 1)}>→</button>
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
