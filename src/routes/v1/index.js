const express = require("express");
const { infoController } = require("../../controllers");
const router = express.Router();
const authRoutes = require("./auth-routes");
const bookingRoutes = require("./bookings-routes");

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.get("/info", infoController);

module.exports = router;
