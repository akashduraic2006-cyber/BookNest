// Book.js - the main catalog item. "category" links to the Category collection.
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    publisher: { type: String, default: "" },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" }, // optional image URL

    // Relationship: each Book belongs to one Category (stores Category's _id)
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    totalCopies: { type: Number, required: true, min: 0, default: 1 },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
  },
  { timestamps: true }
);

// Simple text index so we can search by title/author/isbn with one query
bookSchema.index({ title: "text", author: "text", isbn: "text" });

module.exports = mongoose.model("Book", bookSchema);
