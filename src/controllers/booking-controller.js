const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { Logger } = require("../config");
const AppError = require("../utils/error/app-error");

async function create(req, res) {
  try {
    console.log(req.user);
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

    console.log(error);
    Logger.error({ msg: error.message }, { error: error.stack });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

module.exports = {
  create,
};
