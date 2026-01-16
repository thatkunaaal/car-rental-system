const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { UserService } = require("../services");
const AppError = require("../utils/error/app-error");
const { Logger } = require("../config");

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

async function validateJWT(req, res, next) {
  try {
    if (!req.get("Authorization")) {
      ErrorResponse.error = { explanation: "Authorization header missing" };

      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    const header = req.get("Authorization").trim().split(" ");

    if (header.length < 2) {
      ErrorResponse.error = { explanation: "Token missing after Bearer" };

      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    const bearerToken = header[1];

    const payload = await UserService.verifyToken(bearerToken);

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      ErrorResponse.error = error;

      return res.status(error.StatusCodes).json(ErrorResponse);
    }

    console.log(error);
    Logger.error({ msg: error.message }, { error: error.stack });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

function validateGetBookings(req, res, next) {
  if (!req.query.bookingId && !req.query.summary) {
    ErrorResponse.error = { explanation: "BookingId is missing" };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

function validateUpdateBooking(req, res, next) {
  if (!req.body) {
    ErrorResponse.error = { explanation: "Invalid inputs" };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (
    req.body.status ||
    (req.body.carName && req.body.days && req.body.rentPerDay)
  ) {
    next();
  } else {
    ErrorResponse.error = { explanation: "Invalid inputs" };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
}

function validateDeleteBooking(req, res, next) {
  if (!req.params.bookingId) {
    ErrorResponse.error = { explanation: "Invalid inputs" };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

module.exports = {
  validateSignupRequest,
  validateJWT,
  validateGetBookings,
  validateUpdateBooking,
  validateDeleteBooking,
};
