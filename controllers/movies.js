const Card = require('../models/cards');
const { BadRequestError } = require('../utils/BadRequestError');
const { NotFoundError } = require('../utils/NotFoundError');
const { ServerError } = require('../utils/ServerError');
const { ForbiddenError } = require('../utils/ForbiddenError');

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(
          new BadRequestError(
            `Переданы некорректные данные при создании карточки: ${fields}`,
          ),
        );
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Нет доступа к удалению карточки'));
      }
      return Card.findByIdAndDelete(req.params.cardId).then(() => {
        res.status(200).send({ message: 'Карточка удалена.' });
      });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Некорректный id карточки'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Некорректный id карточки'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Некорректный id карточки'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
