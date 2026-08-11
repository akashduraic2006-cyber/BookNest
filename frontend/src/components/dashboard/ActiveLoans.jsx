// ActiveLoans.jsx - librarian/admin view of every book that is currently out on loan.
import { useEffect, useState } from "react";
import api from "../../api/axios";

function ActiveLoans() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    // /transactions returns every transaction ever made, so we keep only the ones still out
    api.get("/transactions").then((res) => {
      setLoans(res.data.filter((t) => t.status === "issued"));
    });
  }, []);

  if (loans.length === 0) return <p className="text-gray-500">No books are currently out on loan.</p>;

  return (
    <table className="w-full bg-white border rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left text-sm">
        <tr>
          <th className="p-2">Book</th>
          <th className="p-2">Held By</th>
          <th className="p-2">Issue Date</th>
          <th className="p-2">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((t) => {
          const isOverdue = new Date(t.dueDate) < new Date();
          return (
            <tr key={t._id} className="border-t text-sm">
              <td className="p-2">{t.book?.title}</td>
              <td className="p-2">{t.user?.name} ({t.user?.email})</td>
              <td className="p-2">{new Date(t.issueDate).toLocaleDateString()}</td>
              <td className={`p-2 ${isOverdue ? "text-red-600" : ""}`}>
                {new Date(t.dueDate).toLocaleDateString()}
                {isOverdue && " (overdue)"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ActiveLoans;
