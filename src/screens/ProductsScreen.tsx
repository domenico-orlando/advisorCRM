import { NEXT_ACTIONS, PRODUCTS, TIER_NAMES, TIER_RISK } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { Panel } from "../components/Panel";
import { config } from "../config";
import { money, tierBadgeClass } from "../utils/format";
import { byId } from "../utils/selectors";

function productFamilies(): string[] {
  const out: string[] = [];
  PRODUCTS.forEach((p) => { if (!out.includes(p.family)) out.push(p.family); });
  return out;
}

export function ProductsScreen({ store }: { store: CrmStore }) {
  const { state, actions } = store;
  const currency = config.currency;
  const families = ["All", ...productFamilies()];
  const activeCount = PRODUCTS.filter((p) => !state.disabledProducts.includes(p.code)).length;
  const rows = PRODUCTS.filter((p) => state.family === "All" || p.family === state.family);
  const liveProducts = PRODUCTS.filter((p) => !state.disabledProducts.includes(p.code));

  return (
    <div className="page">
      <div className="header-row">
        <div className="push">
          <div className="eyebrow">Product configuration</div>
          <h1 className="page-title">{activeCount} of {PRODUCTS.length} products enabled for sale</h1>
        </div>
        <div className="chip-row" role="group" aria-label="Filter by product family">
          {families.map((f) => (
            <button
              type="button"
              key={f}
              className={"chip-btn" + (state.family === f ? " chip-btn-on" : "")}
              aria-pressed={state.family === f}
              onClick={() => actions.setFamily(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="panel panel-scroll">
        <table className="table" style={{ minWidth: 940, width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Product</th>
              <th style={{ textAlign: "left" }}>Family</th>
              <th style={{ textAlign: "left" }}>Suitable risk bands</th>
              <th className="num">Minimum</th>
              <th className="num">Advisory fee</th>
              <th style={{ textAlign: "left" }}>Share class / wrapper</th>
              <th style={{ textAlign: "left" }}>Approvals</th>
              <th style={{ textAlign: "left" }}>Sale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const on = !state.disabledProducts.includes(p.code);
              return (
                <tr key={p.code} className={on ? "" : "off"}>
                  <td>
                    <div className="product-name">{p.name}</div>
                    <div className="product-meta">{p.code} · {p.provider}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{p.family}</td>
                  <td>
                    <span className="risk-bands">
                      {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className={"risk-band " + (i + 1 >= p.lo && i + 1 <= p.hi ? "fit" : "nofit")} />
                      ))}
                      <span className="band-label">{p.lo}–{p.hi}</span>
                    </span>
                  </td>
                  <td className="num">{p.min === 0 ? "—" : money(p.min, currency)}</td>
                  <td className="num">{p.fee}</td>
                  <td style={{ fontSize: 12 }}>{p.wrapper}</td>
                  <td style={{ fontSize: 12 }}>{p.approval}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      className={"toggle-row" + (on ? "" : " toggle-off")}
                      onClick={() => actions.toggleProductDisabled(p.code)}
                    >
                      <span className="toggle" />
                      {on ? "Enabled" : "Disabled"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="two-col">
        <Panel title="Suitability matrix">
          <div className="table-wrap">
            <table className="table" style={{ width: "100%", minWidth: 340 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Risk tier</th>
                  <th className="num">Eligible products</th>
                  <th style={{ textAlign: "left" }}>Excluded</th>
                </tr>
              </thead>
              <tbody>
                {TIER_NAMES.map((n) => {
                  const risk = TIER_RISK[n];
                  const ok = liveProducts.filter((p) => risk >= p.lo && risk <= p.hi);
                  const no = liveProducts.filter((p) => risk < p.lo || risk > p.hi);
                  return (
                    <tr key={n}>
                      <td><span className={tierBadgeClass(n)}>{n}</span></td>
                      <td className="num"><b>{ok.length} of {liveProducts.length}</b></td>
                      <td className="text-muted" style={{ fontSize: 12 }}>{no.length ? no.map((p) => p.code).join(", ") : "None"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Next best action">
          {NEXT_ACTIONS.map((n, i) => {
            const p = PRODUCTS.find((x) => x.code === n.code)!;
            const c = byId(n.client);
            return (
              <div className="next-action-row" key={i}>
                <span className="next-action-product">
                  <span className="next-action-name">{p.name}</span>
                  <span className="next-action-reason">{n.reason}</span>
                </span>
                <button type="button" className="btn btn-ghost" onClick={() => actions.openClient(c.id)}>{c.name}</button>
                <span className="next-action-value">{money(n.value, currency)}</span>
              </div>
            );
          })}
        </Panel>
      </div>
    </div>
  );
}
