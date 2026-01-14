const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/error/app-error");
const { Logger } = require("../config");

async function signup(req, res) {
  try {
    const user = await UserService.signup({
      username: req.body.username,
      password: req.body.password,
    });

    SuccessResponse.data = user;

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;

    if (error instanceof AppError) {
      return res.status(error.StatusCodes).json(ErrorResponse);
    }

    Logger.error(
      { msg: error.message },
      { error: error.stack }
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

module.exports = {
  signup,
};
