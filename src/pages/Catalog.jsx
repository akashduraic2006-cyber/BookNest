// Catalog.jsx - the homepage: browse, search, filter, and paginate through books.
import { useEffect, useState } from "react";
import api from "../api/axios";
import BookCard from "../components/BookCard";

function Catalog() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // load the category list once, for the filter dropdown
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // re-fetch books whenever search / category / page changes
  useEffect(() => {
    setLoading(true);
    api
      .get("/books", { params: { search, category, page, limit: 8 } })
      .then((res) => {
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  function handleSearchChange(e) {
    setPage(1); // whenever the search text changes, go back to page 1
    setSearch(e.target.value);
  }

  function handleCategoryChange(e) {
    setPage(1);
    setCategory(e.target.value);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book Catalog</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title, author, ISBN..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Catalog;
