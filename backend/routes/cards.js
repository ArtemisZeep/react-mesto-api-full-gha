const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

const { PATTERN } = require('../utils/constants');

router.route('/')
  .get(getCards)
  .post(
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string()
          .required()
          //  eslint-disable-next-line
          .pattern(PATTERN),
      }),
    }),
    createCard,
  );

router.route('/:cardId')
  .delete(
    celebrate({
      params: Joi.object().keys({
        cardId: Joi.string()
          .required()
          .length(24)
          .pattern(/[a-z][0-9]+/),
      }),
    }),
    deleteCard,
  );

router.route('/:cardId/likes')
  .put(
    celebrate({
      params: Joi.object().keys({
        cardId: Joi.string()
          .required()
          .length(24)
          .pattern(/[a-z][0-9]+/),
      }),
    }),
    setLike,
  )
  .delete(
    celebrate({
      params: Joi.object().keys({
        cardId: Joi.string()
          .required()
          .length(24)
          .pattern(/[a-z][0-9]+/),
      }),
    }),
    removeLike,
  );

module.exports = router;
