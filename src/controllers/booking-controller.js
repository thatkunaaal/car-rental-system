const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { Logger } = require("../config");
const AppError = require("../utils/error/app-error");

async function create(req, res) {
  try {
    const booking = await BookingService.create({
      userId: req.user.userId,
      carName: req.body.carName,
      days: req.body.days,
      rentPerDay: req.body.rentPerDay,
    });

    SuccessResponse.message = "Booking created successfully";
    SuccessResponse.data = {
      bookingId: booking.id,
      totalCost: booking.totalCost,
    };

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;

    if (error instanceof AppError) {
      return res.status(error.StatusCodes).json(ErrorResponse);
    }

    Logger.error({ msg: error.message }, { error: error.stack });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function getBooking(req, res) {
  try {
    const booking = await BookingService.getBooking({
      bookingId: req.query.bookingId,
      summary: req.query.summary ? true : false,
      userId: req.user.userId,
      username: req.user.username,
    });

    SuccessResponse.data = booking;

    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;

    if (error instanceof AppError) {
      return res.status(error.StatusCodes).json(ErrorResponse);
    }

    Logger.error({ msg: error.message }, { error: error.stack });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function updateBooking(req, res) {
  try {
    const booking = await BookingService.updateBooking({
      bookingId: req.params.bookingId,
      body: req.body,
      userId: req.user.userId,
    });

    SuccessResponse.data = booking;

    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;

    if (error instanceof AppError) {
      return res.status(error.StatusCodes).json(ErrorResponse);
    }

    Logger.error({ msg: error.message }, { error: error.stack });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

module.exports = {
  create,
  getBooking,
  updateBooking,
};
