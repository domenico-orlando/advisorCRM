import "./styles/tokens.css";
import "./styles/app.css";
import { config } from "./config";
import { useCrmStore } from "./state/useCrmStore";
import { advisorInitials } from "./utils/format";
import { weekLabel } from "./utils/date";
import type { Screen } from "./types";
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

  return (
    <div className="shell">
      <header className="app-header">
        <div className="app-header-row">
          <div className="brand">
            <span className="brand-name">Meridian</span>
            <span className="brand-sub">Advisor Desk</span>
          </div>
          <div className="advisor-block">
            <span className="text-muted">{weekLabel(store.state.viewDate)}</span>
            <span className="advisor-id">
              <span className="advisor-avatar">{advisorInitials(config.advisorName)}</span>
              <span className="advisor-name">{config.advisorName}</span>
            </span>
          </div>
        </div>
        <nav className="app-nav">
          {NAV_ITEMS.map((tab) => {
            const active = screen === tab.key || (tab.key === "clients" && screen === "client");
            return (
              <button
                type="button"
                key={tab.key}
                className={"app-nav-btn" + (active ? " navactive" : "")}
                onClick={() => actions.go(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
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

      <NewAppointmentDialog store={store} />
    </div>
  );
}

export default App;
