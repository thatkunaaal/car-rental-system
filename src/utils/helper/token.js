const jwt = require("jsonwebtoken");
const { ServerConfig, Logger } = require("../../config");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../common");

function generateJWT(payload) {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      ServerConfig.SECRET_KEY,
      { expiresIn: "24h" },
      function (err, token) {
        if (err) {
          rej(err);
        }

        res(token);
      }
    );
  });
}

async function getJWT(payload) {
  try {
    const token = await generateJWT(payload);
    return token;
  } catch (error) {
    Logger.error({ msg: error.message }, { error: error.stack });

    ErrorResponse.error = error;

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

function validateJWT(token) {
  return new Promise((res, rej) => {
    jwt.verify(token, ServerConfig.SECRET_KEY, (err, payload) => {
      if (err) rej(err);

      res(payload);
    });
  });
}

module.exports = {
  getJWT,
  validateJWT,
};
