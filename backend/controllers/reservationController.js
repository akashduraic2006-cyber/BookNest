// reservationController.js - reserve a book, view reservations, cancel/fulfill.
const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

// POST /api/reservations  { bookId }
// A logged-in member reserves a book that currently has 0 available copies.
async function createReservation(req, res) {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies > 0) {
      return res.status(400).json({ message: "Book is available, no need to reserve" });
    }

    const alreadyReserved = await Reservation.findOne({
      book: bookId,
      user: req.user._id,
      status: "pending",
    });
    if (alreadyReserved) {
      return res.status(400).json({ message: "You already reserved this book" });
    }

    const reservation = await Reservation.create({ book: bookId, user: req.user._id });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET /api/reservations/my - logged-in user's own reservations
async function getMyReservations(req, res) {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate("book", "title author availableCopies")
    .sort({ createdAt: -1 });
  res.json(reservations);
}

// GET /api/reservations - librarian/admin: view all pending reservations
async function getAllReservations(req, res) {
  const reservations = await Reservation.find()
    .populate("book", "title author availableCopies")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(reservations);
}

// PUT /api/reservations/:id/cancel - member cancels their own reservation
async function cancelReservation(req, res) {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });

  reservation.status = "cancelled";
  await reservation.save();
  res.json(reservation);
}

// PUT /api/reservations/:id/fulfill - librarian marks reservation as ready/collected
async function fulfillReservation(req, res) {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });

  reservation.status = "fulfilled";
  await reservation.save();
  res.json(reservation);
}

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
  fulfillReservation,
};
