// MyBooks.jsx - shows the logged-in member's current loans, history, and reservations.
import { useEffect, useState } from "react";
import api from "../api/axios";

function MyBooks() {
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);

  function loadData() {
    api.get("/transactions/my").then((res) => setTransactions(res.data));
    api.get("/reservations/my").then((res) => setReservations(res.data));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleReturn(transactionId) {
    await api.put(`/transactions/${transactionId}/return`);
    loadData();
  }

  async function handleCancelReservation(reservationId) {
    await api.put(`/reservations/${reservationId}/cancel`);
    loadData();
  }

  const currentlyBorrowed = transactions.filter((t) => t.status === "issued");
  const history = transactions.filter((t) => t.status === "returned");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-3">Currently Borrowed</h2>
        {currentlyBorrowed.length === 0 ? (
          <p className="text-gray-500">You have no books borrowed right now.</p>
        ) : (
          <ul className="space-y-2">
            {currentlyBorrowed.map((t) => {
              const isOverdue = new Date(t.dueDate) < new Date();
              return (
                <li
                  key={t._id}
                  className="border rounded p-3 flex items-center justify-between bg-white"
                >
                  <div>
                    <p className="font-medium">{t.book?.title}</p>
                    <p className={`text-sm ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                      {isOverdue && " (Overdue!)"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReturn(t._id)}
                    className="bg-indigo-700 text-white px-3 py-1 rounded hover:bg-indigo-800"
                  >
                    Return
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">My Reservations</h2>
        {reservations.length === 0 ? (
          <p className="text-gray-500">You have no active reservations.</p>
        ) : (
          <ul className="space-y-2">
            {reservations.map((r) => (
              <li key={r._id} className="border rounded p-3 flex items-center justify-between bg-white">
                <div>
                  <p className="font-medium">{r.book?.title}</p>
                  <p className="text-sm text-gray-500">
                    Status: {r.status}
                    {r.status === "pending" && r.book?.availableCopies > 0 && " (now available!)"}
                  </p>
                </div>
                {r.status === "pending" && (
                  <button
                    onClick={() => handleCancelReservation(r._id)}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Reading History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No returned books yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((t) => (
              <li key={t._id} className="border rounded p-3 bg-white">
                <p className="font-medium">{t.book?.title}</p>
                <p className="text-sm text-gray-500">
                  Borrowed: {new Date(t.issueDate).toLocaleDateString()} • Returned:{" "}
                  {new Date(t.returnDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyBooks;
