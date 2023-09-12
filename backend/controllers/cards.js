const Card = require('../models/card');
const {
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  BAD_REQUEST_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
  OK_CREATED,
  STATUS_OK,
  CARD_NOT_AUTHORIZED_DELETION_MESSAGE,
} = require('../utils/constants');
const {
  BadRequestError,
  ForbiddenError,
} = require('../errors/errors');

async function getCards(req, res, next) {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (error) {
    next(error);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    const crd = await Card.findById(card._id).populate(['owner', 'likes']);
    res.status(OK_CREATED).send(crd);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
    } else {
      next(error);
    }
  }
}

async function deleteCard(req, res, next) {
  try {
    const card = await Card.findById(req.params.cardId).orFail(() => {
      const error = new Error(CARD_NOT_FOUND_MESSAGE);
      error.name = 'ResourceNotFound';
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    });

    if (req.user._id === card.owner._id.toString()) {
      const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
      res.status(STATUS_OK).send(deletedCard);
    } else {
      throw new ForbiddenError(CARD_NOT_AUTHORIZED_DELETION_MESSAGE);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(error);
    }
  }
}

async function setLike(req, res, next) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes'])
      .orFail(() => {
        const error = new Error(CARD_NOT_FOUND_MESSAGE);
        error.name = 'ResourceNotFound';
        error.statusCode = RESOURCE_NOT_FOUND;
        throw error;
      });

    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(error);
    }
  }
}

async function removeLike(req, res, next) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes'])
      .orFail(() => {
        const error = new Error(CARD_NOT_FOUND_MESSAGE);
        error.name = 'ResourceNotFound';
        error.statusCode = RESOURCE_NOT_FOUND;
        throw error;
      });

    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MESSAGE));
    } else {
      next(error);
    }
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
