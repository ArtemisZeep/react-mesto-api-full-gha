/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { NotAuthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }
};
