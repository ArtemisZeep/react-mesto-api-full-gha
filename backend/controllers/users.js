const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

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

async function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!password) {
    next(new BadRequestError(BAD_REQUEST_MESSAGE));
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    res.status(STATUS_OK_CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } if (error.code === 11000) {
      next(new UserAlreadyExistsError(ALREADY_EXISTS_MESSAGE));
    } else {
      next(error);
    }
  }
}

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

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: JWT_TOKEN_EXPIRES });
    res.cookie('jwt', token, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: true,
    }).status(STATUS_OK).send({ message: SUCCESSFUL_AUTHORIZATION_MESSAGE });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  login,
};
