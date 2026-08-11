// StatsPanel.jsx - shows basic library numbers for the dashboard's "Overview" tab.
import { useEffect, useState } from "react";
import api from "../../api/axios";

function StatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const cards = [
    { label: "Total Books", value: stats.totalBooks },
    { label: "Total Members", value: stats.totalMembers },
    { label: "Books Currently Issued", value: stats.totalIssued },
    { label: "Overdue Books", value: stats.totalOverdue },
    { label: "Pending Reservations", value: stats.totalReservations },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-4 bg-white text-center">
            <p className="text-2xl font-bold text-indigo-700">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-2">Most Popular Books</h3>
      {stats.popularBooks.length === 0 ? (
        <p className="text-gray-500">No borrowing activity yet.</p>
      ) : (
        <ol className="list-decimal list-inside space-y-1">
          {stats.popularBooks.map((b) => (
            <li key={b._id}>
              {b.title} by {b.author} — borrowed {b.borrowCount} time(s)
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default StatsPanel;
