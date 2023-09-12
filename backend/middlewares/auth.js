/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { NotAuthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;


  if (!token) {
    return next(new NotAuthorizedError('Необходима авторизация 1'));
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log('Необходима авторизация 2')
    console.log(JWT_SECRET)
  } catch (err) {
    console.log('Необходима авторизация 3')
    console.log(JWT_SECRET)
    return next(new NotAuthorizedError('Необходима авторизация 3'));
  }

  req.user = payload;

  next();
};
