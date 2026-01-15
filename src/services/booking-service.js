const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const BookingRepo = new BookingRepository();
const { Enum } = require("../utils/common");
const AppError = require("../utils/error/app-error");

async function create(data) {
  try {
    const { days, rentPerDay, carName, userId } = data;

    if (days >= "365" || rentPerDay > 2000) {
      throw new AppError("Invalid inputs", StatusCodes.BAD_REQUEST);
    }

    const cost = days * rentPerDay;
    const BookingData = {
      car_name: carName,
      user_id: userId,
      days: days,
      rent_per_day: rentPerDay,
      status: Enum.BOOKING_TYPE.BOOKED,
      totalCost: cost,
    };

    const booking = await BookingRepo.create(BookingData);
    return booking;
  } catch (error) {
    if (error.name == "SequelizeUniqueConstraintError") {
      let explanation = [];

      explanation = error.errors.map((err) => {
        const errResponse = err.message + ": " + err.value;
        return errResponse;
      });

      throw new AppError(explanation, StatusCodes.CONFLICT);
    }

    if (error.name == "SequelizeValidationError") {
      let explanation = [];

      explanation = error.errors.map((err) => {
        const errResponse = err.message + ": " + err.value;
        return errResponse;
      });

      throw new AppError(explanation, StatusCodes.CONFLICT);
    }

    throw error;
  }
}

module.exports = {
  create,
};
