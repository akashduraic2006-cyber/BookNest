// CategoriesManager.jsx - librarian/admin can add and delete book categories.
import { useEffect, useState } from "react";
import api from "../../api/axios";

function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function loadCategories() {
    api.get("/categories").then((res) => setCategories(res.data));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/categories", { name, description });
    setName("");
    setDescription("");
    loadCategories();
  }

  async function handleDelete(id) {
    await api.delete(`/categories/${id}`);
    loadCategories();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6 bg-white p-4 border rounded-lg">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border rounded px-3 py-2 flex-1"
        />
        <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800">
          Add Category
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c._id} className="border rounded p-3 bg-white flex items-center justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">{c.description}</p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="text-red-600 underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesManager;
