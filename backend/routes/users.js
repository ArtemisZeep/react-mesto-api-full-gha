const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { PATTERN } = require('../utils/constants');

// Маршрут для получения списка пользователей
router.get('/', getUsers);

// Маршрут для получения текущего пользователя
router.get('/me', getUserById);

// Маршрут для получения пользователя по ID
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
  }),
  getUserById,
);

// Маршрут для обновления информации о текущем пользователе
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);

// Маршрут для обновления аватара текущего пользователя
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        //  eslint-disable-next-line
        .pattern(PATTERN),
    }),
  }),
  updateAvatar,
);

module.exports = router;
