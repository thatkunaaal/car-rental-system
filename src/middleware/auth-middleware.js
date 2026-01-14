const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");

function validateSignupRequest(req, res, next) {
  if (!req.body) {
    ErrorResponse.error = {
      explanation: "Username and password should be present for user creation.",
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }

  if (!req.body.username) {
    ErrorResponse.error = {
      explanation: "Username should be passed for user creation.",
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }

  if (!req.body.password) {
    ErrorResponse.error = {
      explanation: "Password should be passed for user creation.",
    };
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }

  next();
}

module.exports = {
  validateSignupRequest,
};
