// bookRoutes.js
const express = require("express");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getBooks); // public catalog browsing
router.get("/:id", getBookById); // public book details

router.post("/", protect, authorize("librarian", "admin"), createBook);
router.put("/:id", protect, authorize("librarian", "admin"), updateBook);
router.delete("/:id", protect, authorize("librarian", "admin"), deleteBook);

module.exports = router;
