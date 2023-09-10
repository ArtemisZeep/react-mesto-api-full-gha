/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const {
  SECRET_KEY,
} = require('../utils/constants');
const { NotAuthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }
};
