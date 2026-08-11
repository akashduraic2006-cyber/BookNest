// BookDetails.jsx - single book page with Borrow / Reserve actions.
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");

  function loadBook() {
    api.get(`/books/${id}`).then((res) => setBook(res.data));
  }

  useEffect(() => {
    loadBook();
  }, [id]);

  async function handleBorrow() {
    setMessage("");
    try {
      await api.post("/transactions/issue", { bookId: id });
      setMessage("Book borrowed successfully! Check 'My Books' for the due date.");
      loadBook(); // refresh availableCopies
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not borrow this book");
    }
  }

  async function handleReserve() {
    setMessage("");
    try {
      await api.post("/reservations", { bookId: id });
      setMessage("Book reserved! You'll be able to collect it once it's returned.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not reserve this book");
    }
  }

  if (!book) return <p className="p-6">Loading...</p>;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
      <p className="text-gray-600 mb-1">by {book.author}</p>
      <p className="text-sm text-gray-500 mb-4">
        {book.category?.name} • ISBN: {book.isbn} • Publisher: {book.publisher || "N/A"}
      </p>

      <p className="mb-4">{book.description}</p>

      <p className="mb-4">
        Copies available: <strong>{book.availableCopies}</strong> / {book.totalCopies}
      </p>

      {message && <p className="text-indigo-700 bg-indigo-50 p-2 rounded mb-4">{message}</p>}

      {!user && <p className="text-gray-500">Login to borrow or reserve this book.</p>}

      {user && (
        <div className="flex gap-3">
          {isAvailable ? (
            <button
              onClick={handleBorrow}
              className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
            >
              Borrow this book
            </button>
          ) : (
            <button
              onClick={handleReserve}
              className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
            >
              Reserve this book
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default BookDetails;
