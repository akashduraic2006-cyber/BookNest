// Transaction.js - one record per book issue/return event.
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true }, // issueDate + 14 days (set in controller)
    returnDate: { type: Date, default: null }, // filled in when the book is returned

    status: {
      type: String,
      enum: ["issued", "returned"], // "overdue" is calculated on the fly, not stored
      default: "issued",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
