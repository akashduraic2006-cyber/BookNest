// categoryRoutes.js
const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCategories); // anyone can view categories

// only librarian/admin can add, edit, delete
router.post("/", protect, authorize("librarian", "admin"), createCategory);
router.put("/:id", protect, authorize("librarian", "admin"), updateCategory);
router.delete("/:id", protect, authorize("librarian", "admin"), deleteCategory);

module.exports = router;
