const express = require("express");
const { AuthMiddleware } = require("../../middleware");
const { BookingController } = require("../../controllers");
const router = express.Router();

router.post("/", AuthMiddleware.validateJWT, BookingController.create);
// router.get("/");
// router.put("/:bookingId");
// router.delete("/bookingId");

module.exports = router;
