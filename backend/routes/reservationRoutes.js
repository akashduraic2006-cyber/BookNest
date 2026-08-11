// reservationRoutes.js
const express = require("express");
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
  fulfillReservation,
} = require("../controllers/reservationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.put("/:id/cancel", protect, cancelReservation);

router.get("/", protect, authorize("librarian", "admin"), getAllReservations);
router.put("/:id/fulfill", protect, authorize("librarian", "admin"), fulfillReservation);

module.exports = router;
