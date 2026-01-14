class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.explanaion = message;
    this.StatusCodes = statusCode;
  }
}

module.exports = AppError;
