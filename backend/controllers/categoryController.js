// categoryController.js - basic Create/Read/Update/Delete for categories.
const Category = require("../models/Category");

// GET /api/categories - public, anyone can view the list
async function getCategories(req, res) {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
}

// POST /api/categories - librarian/admin only
async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// PUT /api/categories/:id - librarian/admin only
async function updateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// DELETE /api/categories/:id - librarian/admin only
async function deleteCategory(req, res) {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category deleted" });
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
