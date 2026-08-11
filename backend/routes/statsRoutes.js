// statsRoutes.js
const express = require("express");
const { getDashboardStats } = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, authorize("librarian", "admin"), getDashboardStats);

module.exports = router;
