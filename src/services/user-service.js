const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { TokenUtil } = require("../utils/helper");
const bcrypt = require("bcrypt");
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

      throw new AppError(explanation, StatusCodes.CONFLICT);
    }

    throw error;
  }
}

async function login(data) {
  try {
    const { username, password } = data;
    const isUserPresent = await UserRepo.findUser(username);

    if (!isUserPresent) {
      throw new AppError("User does not exist", StatusCodes.UNAUTHORIZED);
    }

    const user = isUserPresent;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new AppError("Incorrect password", StatusCodes.UNAUTHORIZED);
    }

    const token = await TokenUtil.getJWT({
      userId: user.id,
      username: user.username,
    });

    return token;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw error;
  }
}

async function verifyToken(token) {
  try {
    const payload = await TokenUtil.validateJWT(token);

    const { userId, username } = payload;

    const user = await UserRepo.get(userId);

    if (!user) {
      throw new AppError("Token invalid", StatusCodes.UNAUTHORIZED);
    }

    return payload;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signup,
  login,
  verifyToken,
};
