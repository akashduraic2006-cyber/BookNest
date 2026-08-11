// OverdueList.jsx - librarian/admin view of all books that are past their due date.
import { useEffect, useState } from "react";
import api from "../../api/axios";

function OverdueList() {
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {
    api.get("/transactions/overdue").then((res) => setOverdue(res.data));
  }, []);

  if (overdue.length === 0) return <p className="text-gray-500">No overdue books right now.</p>;

  return (
    <table className="w-full bg-white border rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left text-sm">
        <tr>
          <th className="p-2">Book</th>
          <th className="p-2">Borrowed By</th>
          <th className="p-2">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {overdue.map((t) => (
          <tr key={t._id} className="border-t text-sm">
            <td className="p-2">{t.book?.title}</td>
            <td className="p-2">{t.user?.name} ({t.user?.email})</td>
            <td className="p-2 text-red-600">{new Date(t.dueDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OverdueList;
