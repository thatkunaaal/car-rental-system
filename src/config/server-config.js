const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT: process.env.SALT,
  SECRET_KEY: process.env.SECRET_KEY,
};
