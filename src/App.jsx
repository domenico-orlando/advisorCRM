import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CalendarView from "./components/CalendarView";
import ClientsView from "./components/ClientsView";
import PipelineView from "./components/PipelineView";
import ReportsView from "./components/ReportsView";
import { clients as initialClients, followUps as initialFollowUps } from "./data";

export default function App() {
  const [tab, setTab] = useState("calendar");
  const [clients, setClients] = useState(initialClients);
  const [followUps, setFollowUps] = useState(initialFollowUps);

  const saveClient = (updated) => {
    setClients((prev) => {
      const exists = prev.find((c) => c.id === updated.id);
      if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
      return [...prev, { ...updated, id: Date.now() }];
    });
  };

  const saveFollowUp = (updated) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar tab={tab} setTab={setTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === "calendar" && (
          <CalendarView followUps={followUps} onSaveFollowUp={saveFollowUp} />
        )}
        {tab === "clients" && (
          <ClientsView clients={clients} onSaveClient={saveClient} />
        )}
        {tab === "pipeline" && <PipelineView />}
        {tab === "reports" && <ReportsView clients={clients} />}
      </main>
    </div>
  );
}
