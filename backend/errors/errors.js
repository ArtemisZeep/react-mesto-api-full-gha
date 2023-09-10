/* eslint-disable max-classes-per-file */
const {
  STATUS_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  STATUS_NOT_AUTHORIZED,
  STATUS_FORBIDDEN,
} = require('../utils/constants');

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, RESOURCE_NOT_FOUND);
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, BAD_REQUEST);
  }
}

class NotAuthorizedError extends CustomError {
  constructor(message) {
    super(message, STATUS_NOT_AUTHORIZED);
  }
}

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message, STATUS_FORBIDDEN);
  }
}

class UserAlreadyExistsError extends CustomError {
  constructor(message) {
    super(message, STATUS_ALREADY_EXISTS);
  }
}

// eslint-disable-next-line no-unused-vars
function handleAllErrors(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}

module.exports = {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  ForbiddenError,
  UserAlreadyExistsError,
  handleAllErrors,
};
