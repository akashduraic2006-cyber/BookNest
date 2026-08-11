// LibrarianDashboard.jsx - a single page with tabs for each admin task.
import { useState } from "react";
import StatsPanel from "../components/dashboard/StatsPanel";
import BooksManager from "../components/dashboard/BooksManager";
import CategoriesManager from "../components/dashboard/CategoriesManager";
import ActiveLoans from "../components/dashboard/ActiveLoans";
import OverdueList from "../components/dashboard/OverdueList";
import ReservationsManager from "../components/dashboard/ReservationsManager";

const TABS = [
  { key: "stats", label: "Overview" },
  { key: "books", label: "Manage Books" },
  { key: "categories", label: "Manage Categories" },
  { key: "loans", label: "Borrowed Details" },
  { key: "overdue", label: "Overdue Books" },
  { key: "reservations", label: "Reservations" },
];

function LibrarianDashboard() {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Librarian Dashboard</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded ${
              activeTab === tab.key ? "bg-indigo-700 text-white" : "bg-white border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Only the component matching the active tab is rendered */}
      {activeTab === "stats" && <StatsPanel />}
      {activeTab === "books" && <BooksManager />}
      {activeTab === "categories" && <CategoriesManager />}
      {activeTab === "loans" && <ActiveLoans />}
      {activeTab === "overdue" && <OverdueList />}
      {activeTab === "reservations" && <ReservationsManager />}
    </div>
  );
}

export default LibrarianDashboard;
