import "./styles/tokens.css";
import "./styles/app.css";
import { config } from "./config";
import { useCrmStore } from "./state/useCrmStore";
import { advisorInitials } from "./utils/format";
import { longDate, todayIso } from "./utils/date";
import { isOverdue, openTasks } from "./utils/selectors";
import type { Screen } from "./types";
import { NavIcon } from "./components/NavIcon";
import { CalendarScreen } from "./screens/CalendarScreen";
import { ClientsScreen } from "./screens/ClientsScreen";
import { ClientDetailScreen } from "./screens/ClientDetailScreen";
import { TasksScreen } from "./screens/TasksScreen";
import { PipelineScreen } from "./screens/PipelineScreen";
import { ProductsScreen } from "./screens/ProductsScreen";
import { ReportsScreen } from "./screens/ReportsScreen";
import { NewAppointmentDialog } from "./components/NewAppointmentDialog";

const NAV_ITEMS: { label: string; key: Screen }[] = [
  { label: "Calendar", key: "calendar" },
  { label: "Clients", key: "clients" },
  { label: "Follow-ups", key: "tasks" },
  { label: "Pipeline", key: "pipeline" },
  { label: "Products", key: "products" },
  { label: "Reports", key: "reports" },
];

function App() {
  const store = useCrmStore();
  const { screen, actions } = store;
  const overdueCount = openTasks(store.state.tasks).filter(isOverdue).length;

  return (
    <div className="shell">
      {/* The rail is the only large brand-coloured surface (rule 1). */}
      <aside className="rail">
        <div className="rail-brand">
          <b>{config.firmName}</b>
          <span>{config.productName}</span>
        </div>
        <nav className="rail-nav">
          {NAV_ITEMS.map((tab) => {
            const active = screen === tab.key || (tab.key === "clients" && screen === "client");
            return (
              <button
                type="button"
                key={tab.key}
                className={"rail-btn" + (active ? " rail-btn-on" : "")}
                aria-current={active ? "page" : undefined}
                onClick={() => actions.go(tab.key)}
              >
                <NavIcon screen={tab.key} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="rail-me">
          <span className="avatar">{advisorInitials(config.advisorName)}</span>
          <span>
            <b>{config.advisorName}</b>
            <span>{config.advisorEmail}</span>
          </span>
        </div>
      </aside>

      <div className="app-body">
        <header className="topbar">
          <span className="topbar-context">{longDate(todayIso())}</span>
          <span className="topbar-spacer" />
          <div className="topbar-actions">
            <button
              type="button"
              className="ico-btn"
              title={`${overdueCount} overdue follow-ups`}
              aria-label={`${overdueCount} overdue follow-ups`}
              onClick={() => actions.go("tasks")}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {overdueCount > 0 && <i>{overdueCount}</i>}
            </button>
            {/* Quick create — the calendar already carries the primary action */}
            {screen !== "calendar" && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => actions.openNew()}>
                New appointment
              </button>
            )}
          </div>
        </header>

        <main className="app-main">
          {screen === "calendar" && <CalendarScreen store={store} />}
          {screen === "clients" && <ClientsScreen store={store} />}
          {screen === "client" && <ClientDetailScreen store={store} />}
          {screen === "tasks" && <TasksScreen store={store} />}
          {screen === "pipeline" && <PipelineScreen store={store} />}
          {screen === "products" && <ProductsScreen store={store} />}
          {screen === "reports" && <ReportsScreen store={store} />}
        </main>
      </div>

      <NewAppointmentDialog store={store} />
    </div>
  );
}

export default App;
