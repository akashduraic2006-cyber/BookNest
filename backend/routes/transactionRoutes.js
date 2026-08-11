// transactionRoutes.js
const express = require("express");
const {
  issueBook,
  returnBook,
  getMyTransactions,
  getAllTransactions,
  getOverdueTransactions,
} = require("../controllers/transactionController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/my", protect, getMyTransactions); // any logged-in user: their own history

router.post("/issue", protect, issueBook); // any logged-in user can borrow a book
router.put("/:id/return", protect, returnBook); // owner or librarian/admin can return

// librarian/admin only
router.get("/", protect, authorize("librarian", "admin"), getAllTransactions);
router.get("/overdue", protect, authorize("librarian", "admin"), getOverdueTransactions);

module.exports = router;
