// BookCard.jsx - a small card showing one book in the catalog grid.
import { Link } from "react-router-dom";

function BookCard({ book }) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Link
      to={`/books/${book._id}`}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition block bg-white"
    >
      <h3 className="font-semibold text-lg mb-1 truncate">{book.title}</h3>
      <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
      <p className="text-xs text-gray-500 mb-2">{book.category?.name}</p>

      <span
        className={`text-xs font-medium px-2 py-1 rounded ${
          isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isAvailable ? `Available (${book.availableCopies})` : "Not Available"}
      </span>
    </Link>
  );
}

export default BookCard;
