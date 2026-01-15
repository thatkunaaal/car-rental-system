const CrudRepository = require("./crud-repository");
const { users } = require("../models");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");

class UserRepository extends CrudRepository {
  constructor() {
    super(users);
  }

  async findUser(data) {
    const response = await users.findOne({
      where: {
        username: data,
      },
    });

    if (!response) {
      throw new AppError("User does not exist", StatusCodes.UNAUTHORIZED);
    }

    return response;
  }
}

module.exports = UserRepository;
