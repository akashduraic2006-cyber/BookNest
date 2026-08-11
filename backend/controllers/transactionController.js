// transactionController.js - issue book, return book, view history, overdue list.
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");

const LOAN_PERIOD_DAYS = 14;

// POST /api/transactions/issue  { bookId, userId }
// A member borrows a book for themselves. A librarian/admin can issue to any member
// by passing userId in the body; otherwise it defaults to the logged-in user.
async function issueBook(req, res) {
  try {
    const { bookId } = req.body;
    const isStaff = req.user.role === "librarian" || req.user.role === "admin";
    const userId = isStaff && req.body.userId ? req.body.userId : req.user._id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies available, please reserve instead" });
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + LOAN_PERIOD_DAYS);

    const transaction = await Transaction.create({
      book: bookId,
      user: userId,
      issueDate,
      dueDate,
      status: "issued",
    });

    // one less copy is now on loan
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// PUT /api/transactions/:id/return
// A member can return their own book; a librarian/admin can return anyone's.
async function returnBook(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    const isStaff = req.user.role === "librarian" || req.user.role === "admin";
    if (!isStaff && transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only return your own books" });
    }

    if (transaction.status === "returned") {
      return res.status(400).json({ message: "This book was already returned" });
    }

    transaction.status = "returned";
    transaction.returnDate = new Date();
    await transaction.save();

    // give the copy back to the library
    const book = await Book.findById(transaction.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET /api/transactions/my - logged-in user's own borrowing history
async function getMyTransactions(req, res) {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate("book", "title author coverImage")
    .sort({ createdAt: -1 });
  res.json(transactions);
}

// GET /api/transactions - librarian/admin: view all transactions
async function getAllTransactions(req, res) {
  const transactions = await Transaction.find()
    .populate("book", "title author")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(transactions);
}

// GET /api/transactions/overdue - librarian/admin: books not returned past due date
async function getOverdueTransactions(req, res) {
  const overdue = await Transaction.find({
    status: "issued",
    dueDate: { $lt: new Date() }, // due date already passed
  })
    .populate("book", "title author")
    .populate("user", "name email");

  res.json(overdue);
}

module.exports = {
  issueBook,
  returnBook,
  getMyTransactions,
  getAllTransactions,
  getOverdueTransactions,
};
