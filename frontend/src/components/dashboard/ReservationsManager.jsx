// ReservationsManager.jsx - librarian/admin view of all reservations, can mark as fulfilled.
import { useEffect, useState } from "react";
import api from "../../api/axios";

function ReservationsManager() {
  const [reservations, setReservations] = useState([]);

  function loadReservations() {
    api.get("/reservations").then((res) => setReservations(res.data));
  }

  useEffect(() => {
    loadReservations();
  }, []);

  async function handleFulfill(id) {
    await api.put(`/reservations/${id}/fulfill`);
    loadReservations();
  }

  if (reservations.length === 0) return <p className="text-gray-500">No reservations yet.</p>;

  return (
    <table className="w-full bg-white border rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left text-sm">
        <tr>
          <th className="p-2">Book</th>
          <th className="p-2">Reserved By</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => (
          <tr key={r._id} className="border-t text-sm">
            <td className="p-2">{r.book?.title}</td>
            <td className="p-2">{r.user?.name} ({r.user?.email})</td>
            <td className="p-2">{r.status}</td>
            <td className="p-2">
              {r.status === "pending" && (
                <button onClick={() => handleFulfill(r._id)} className="text-indigo-700 underline">
                  Mark Fulfilled
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReservationsManager;
