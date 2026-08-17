import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CalendarView from "./components/CalendarView";
import ClientsView from "./components/ClientsView";
import PipelineView from "./components/PipelineView";
import ReportsView from "./components/ReportsView";

export default function App() {
  const [tab, setTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar tab={tab} setTab={setTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === "calendar" && <CalendarView />}
        {tab === "clients" && <ClientsView />}
        {tab === "pipeline" && <PipelineView />}
        {tab === "reports" && <ReportsView />}
      </main>
    </div>
  );
}
