import React from "react";
import { Calendar, Users, TrendingUp, BarChart2 } from "lucide-react";
import { advisor } from "../data";

const tabs = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "reports", label: "Reports", icon: BarChart2 },
];

export default function Navbar({ tab, setTab }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="font-bold text-lg tracking-tight text-gray-900">Advisor CRM</span>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tab === id
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <span className="hidden sm:block text-sm text-gray-500">
          {advisor.name}, {advisor.title}
        </span>

        {/* Mobile nav */}
        <nav className="flex sm:hidden gap-1">
          {tabs.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`p-2 rounded transition-colors ${
                tab === id ? "text-orange-600" : "text-gray-500"
              }`}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
