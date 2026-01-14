const express = require("express");
const { UserController } = require("../../controllers");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();

router.post(
  "/signup",
  AuthMiddleware.validateSignupRequest,
  UserController.signup
);
// router.post("/login");

module.exports = router;
