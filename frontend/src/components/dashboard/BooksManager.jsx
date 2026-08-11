// BooksManager.jsx - librarian/admin can add, edit, and delete books here.
import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  description: "",
  category: "",
  totalCopies: 1,
};

function BooksManager() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding a new book
  const [error, setError] = useState("");

  function loadBooks() {
    // limit=100 so we can see the whole catalog on one admin page (fine for a small demo dataset)
    api.get("/books", { params: { limit: 100 } }).then((res) => setBooks(res.data.books));
  }

  useEffect(() => {
    loadBooks();
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(book) {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      description: book.description,
      category: book.category?._id || "",
      totalCopies: book.totalCopies,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, form);
      } else {
        await api.post("/books", form);
      }
      cancelEdit();
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save book");
    }
  }

  async function handleDelete(id) {
    await api.delete(`/books/${id}`);
    loadBooks();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-white p-4 border rounded-lg">
        <h3 className="sm:col-span-2 font-semibold">{editingId ? "Edit Book" : "Add a New Book"}</h3>

        {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border rounded px-3 py-2" required />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="border rounded px-3 py-2" required />
        <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" className="border rounded px-3 py-2" required />
        <input name="publisher" value={form.publisher} onChange={handleChange} placeholder="Publisher" className="border rounded px-3 py-2" />

        <select name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2" required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          name="totalCopies"
          value={form.totalCopies}
          onChange={handleChange}
          placeholder="Total Copies"
          className="border rounded px-3 py-2"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border rounded px-3 py-2 sm:col-span-2"
        />

        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800">
            {editingId ? "Save Changes" : "Add Book"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="border px-4 py-2 rounded hover:bg-gray-100">
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Category</th>
            <th className="p-2">Copies</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className="border-t text-sm">
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.category?.name}</td>
              <td className="p-2">{book.availableCopies} / {book.totalCopies}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => startEdit(book)} className="text-indigo-700 underline">Edit</button>
                <button onClick={() => handleDelete(book._id)} className="text-red-600 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BooksManager;
