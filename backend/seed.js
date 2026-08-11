// seed.js - run with: npm run seed
// Wipes existing data and inserts sample categories, books and users for demo purposes.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Book = require("./models/Book");
const User = require("./models/User");

async function seed() {
  await connectDB();

  await Promise.all([Category.deleteMany(), Book.deleteMany(), User.deleteMany()]);

  const categories = await Category.insertMany([
    { name: "Fiction", description: "Novels and story books" },
    { name: "Science", description: "Science and technology books" },
    { name: "History", description: "Historical books" },
  ]);

  await Book.insertMany([
    {
      title: "The Silent Ocean",
      author: "A. Marin",
      isbn: "ISBN-0001",
      publisher: "Blue Press",
      description: "A fictional adventure across the sea.",
      category: categories[0]._id,
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: "Introduction to Physics",
      author: "R. Kumar",
      isbn: "ISBN-0002",
      publisher: "EduBooks",
      description: "Fundamentals of physics for beginners.",
      category: categories[1]._id,
      totalCopies: 2,
      availableCopies: 2,
    },
    {
      title: "World War Chronicles",
      author: "J. Smith",
      isbn: "ISBN-0003",
      publisher: "HistoryHouse",
      description: "A detailed account of world war events.",
      category: categories[2]._id,
      totalCopies: 1,
      availableCopies: 1,
    },
  ]);

  const hashedPassword = await bcrypt.hash("password123", 10);
  await User.insertMany([
    { name: "Admin User", email: "admin@booknest.com", password: hashedPassword, role: "admin" },
    {
      name: "Librarian User",
      email: "librarian@booknest.com",
      password: hashedPassword,
      role: "librarian",
    },
    { name: "Member User", email: "member@booknest.com", password: hashedPassword, role: "member" },
  ]);

  console.log("Sample data inserted. Login with password: password123");
  process.exit(0);
}

seed();
