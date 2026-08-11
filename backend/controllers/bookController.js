// bookController.js - CRUD for books + search/filter/pagination logic.
const Book = require("../models/Book");

// GET /api/books?search=harry&category=<id>&page=1&limit=8
// Public route - anyone (even logged out) can browse the catalog.
async function getBooks(req, res) {
  try {
    const { search, category, page = 1, limit = 8 } = req.query;

    const query = {}; // this object will be passed to Book.find()

    if (search) {
      // $text uses the text index we defined on the Book model (title, author, isbn)
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // run the count and the actual data fetch
    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate("category", "name") // replaces category ObjectId with { _id, name }
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      books,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBooks / limitNumber),
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET /api/books/:id - single book details
async function getBookById(req, res) {
  const book = await Book.findById(req.params.id).populate("category", "name");
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
}

// POST /api/books - librarian/admin only
async function createBook(req, res) {
  try {
    const { title, author, isbn, publisher, description, coverImage, category, totalCopies } =
      req.body;

    const book = await Book.create({
      title,
      author,
      isbn,
      publisher,
      description,
      coverImage,
      category,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1, // when a book is first added, all copies are available
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// PUT /api/books/:id - librarian/admin only
async function updateBook(req, res) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// DELETE /api/books/:id - librarian/admin only
async function deleteBook(req, res) {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book deleted" });
}

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
