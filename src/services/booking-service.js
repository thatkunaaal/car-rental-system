const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const BookingRepo = new BookingRepository();
const { Enum } = require("../utils/common");
const { BOOKED, COMPLETED } = Enum.BOOKING_TYPE;
const AppError = require("../utils/error/app-error");
const { Op } = require("sequelize");

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
    };

    const booking = await BookingRepo.create(BookingData);

    const bookingPOJO = booking.toJSON();
    bookingPOJO.totalCost = cost;

    return bookingPOJO;
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

async function getBooking(data) {
  try {
    const { bookingId, summary, userId, username } = data;

    if (summary) {
      const booking = await BookingRepo.getByFilter({
        user_id: userId,
        status: {
          [Op.in]: [BOOKED, COMPLETED],
        },
      });

      const obj = {
        userId,
        username,
        totalBooking: booking.length,
      };

      let sum = 0;

      for (ele of booking) {
        const plainBooking = ele.toJSON();
        const cost = plainBooking.days * plainBooking.rent_per_day;
        sum += cost;
      }

      obj.totalAmountSpent = sum;

      return obj;
    }

    const booking = await BookingRepo.get(bookingId);

    const plainBooking = booking.toJSON();
    delete plainBooking.createdAt;
    delete plainBooking.updatedAt;

    const bookingArr = [];
    bookingArr.push(plainBooking);

    return bookingArr;
  } catch (error) {
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

async function updateBooking(data) {
  try {
    const { bookingId, body, userId } = data;

    const booking = await BookingRepo.get(bookingId);

    if (!booking) {
      throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
    }

    const bookingPOJO = booking.toJSON();

    if (bookingPOJO.user_id != userId) {
      throw new AppError(
        "Mentioned Booking does not belong to user",
        StatusCodes.FORBIDDEN
      );
    }

    const modifiedBooking = await BookingRepo.update(bookingId, {
      car_name: body.carName,
      status: body.status,
      days: body.days,
      rent_per_day: body.rentPerDay,
    });

    const response = await BookingRepo.get(bookingId);
    return response;
  } catch (error) {
    if (error.name == "SequelizeValidationError") {
      let explanation = [];

      explanation = error.errors.map((err) => {
        const errResponse = err.message + ": " + err.value;
        return errResponse;
      });

      throw new AppError(explanation, StatusCodes.CONFLICT);
    }
  }

  throw error;
}

async function deleteBooking(data) {
  try {
    const { userId, id } = data;
    const booking = await BookingRepo.get(id);

    if (!booking) {
      throw new AppError("booking not found", StatusCodes.NOT_FOUND);
    }

    const pojoBooking = booking.toJSON();
    
    if (pojoBooking.user_id != userId) {
      throw new AppError(
        "Booking does not belong to this user",
        StatusCodes.FORBIDDEN
      );
    }

    const deleteBooking = await BookingRepo.destroy(id);

    return deleteBooking;
  } catch (error) {
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
  getBooking,
  updateBooking,
  deleteBooking,
};
