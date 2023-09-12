const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;

const {
  RESOURCE_NOT_FOUND,
  BAD_REQUEST_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  STATUS_OK_CREATED,
  STATUS_OK,
  SUCCESSFUL_AUTHORIZATION_MESSAGE,
  ALREADY_EXISTS_MESSAGE,
  USERS_NOT_FOUND_MESSAGE,
  SECRET_KEY,
  JWT_TOKEN_EXPIRES,
  COOKIE_MAX_AGE,
} = require('../utils/constants');

const {
  NotFoundError,
  BadRequestError,
  UserAlreadyExistsError,
} = require('../errors/errors');

async function getUsers(req, res, next) {
  try {
    const users = await User.find({}).orFail(() => {
      const error = new Error(USERS_NOT_FOUND_MESSAGE);
      error.name = 'ResourceNotFound';
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
}

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash, // записываем хеш в базу
  }))
  .then((user) => res.status(STATUS_OK_CREATED).send({ data: user }))
  .catch((err) => {
    if (err.code === 11000) {
      next(new UserAlreadyExistsError(ALREADY_EXISTS_MESSAGE));
      return;
    }
    if (error.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(err);
    }
  });
};

async function getUserById(req, res, next) {
  const userId = req.params.userId || req.user._id;

  try {
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    });
    res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(error);
    }
  }
}

async function updateUser(req, res, next) {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    });
    res.send(user);
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(error);
    }
  }
}

async function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
      upsert: false,
    }).orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    });

    res.send(user);
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(error);
    }
  }
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRES });
    res.cookie('jwt', token, {
      // token - наш JWT токен, который мы отправляем
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true, // указали браузеру посылать куки, только если запрос с того же домена
    })
    // отправим токен пользователю
      .send({ message: 'Успешная авторизация' });
  })
  .catch((err) => next(err));
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из системы' });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  logout
};
