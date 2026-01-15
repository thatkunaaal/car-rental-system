const express = require("express");
const { UserController } = require("../../controllers");
const { AuthMiddleware } = require("../../middleware");
const router = express.Router();


/*
    POST: /signup
    {username , password}
*/
router.post(
  "/signup",
  AuthMiddleware.validateSignupRequest,
  UserController.signup
);

/*
    POST: /login
    {username , password}
*/
router.post("/login",AuthMiddleware.validateSignupRequest,UserController.login);

module.exports = router;
