const express = require("express");
const { AuthMiddleware } = require("../../middleware");
const { BookingController } = require("../../controllers");
const router = express.Router();

router.post("/", AuthMiddleware.validateJWT, BookingController.create);
router.get(
  "/",
  AuthMiddleware.validateJWT,
  AuthMiddleware.validateGetBookings,
  BookingController.getBooking
);
router.put(
  "/:bookingId",
  AuthMiddleware.validateJWT,
  AuthMiddleware.validateUpdateBooking,
  BookingController.updateBooking
);
router.delete(
  "/:bookingId",
  AuthMiddleware.validateJWT,
  AuthMiddleware.validateDeleteBooking,
  BookingController.deleteBooking
);

module.exports = router;
