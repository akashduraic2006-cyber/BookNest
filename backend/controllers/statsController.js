// statsController.js - basic counts for the librarian/admin dashboard.
const Book = require("../models/Book");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Reservation = require("../models/Reservation");

// GET /api/stats - librarian/admin only
async function getDashboardStats(req, res) {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await User.countDocuments({ role: "member" });
    const totalIssued = await Transaction.countDocuments({ status: "issued" });
    const totalOverdue = await Transaction.countDocuments({
      status: "issued",
      dueDate: { $lt: new Date() },
    });
    const totalReservations = await Reservation.countDocuments({ status: "pending" });

    // Popular books = books borrowed the most number of times.
    // $group groups transactions by book and counts how many times each appears.
    const popularBooks = await Transaction.aggregate([
      { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books", // the actual MongoDB collection name for the Book model
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      { $project: { borrowCount: 1, title: "$bookDetails.title", author: "$bookDetails.author" } },
    ]);

    res.json({
      totalBooks,
      totalMembers,
      totalIssued,
      totalOverdue,
      totalReservations,
      popularBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getDashboardStats };
