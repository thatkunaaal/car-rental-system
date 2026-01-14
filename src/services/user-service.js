const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const UserRepo = new UserRepository();


async function signup(data) {
  try {
    const user = await UserRepo.create(data);
    return user;
  } catch (error) {

    if (error.name == "SequelizeUniqueConstraintError") {
      let explanation = [];

      explanation = error.errors.map((err) => {
        const errResponse = err.message + ": " + err.value;
        return errResponse;
      });

      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    throw error;
  }
}

module.exports = {
  signup,
};
