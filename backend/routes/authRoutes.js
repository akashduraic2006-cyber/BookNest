// authRoutes.js - maps URLs to authController functions.
const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); // protected: needs a valid token

module.exports = router;
