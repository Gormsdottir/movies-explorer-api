const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../utils/BadRequestError');
const { NotFoundError } = require('../utils/NotFoundError');
const { ServerError } = require('../utils/ServerError');
const { ConflictError } = require('../utils/ConflictError');
const {
  BadRequestErrorTxt,
  ConflictErrorTxt,
  ServerErrorTxt,
  NotFoundUserTxt,
} = require('../utils/error-messages');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(
              new BadRequestError(BadRequestErrorTxt),
            );
            return;
          }
          if (err.code === 11000) {
            next(
              new ConflictError(ConflictErrorTxt),
            );
            return;
          }

          next(new ServerError(ServerErrorTxt));
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NotFoundUserTxt);
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => {
      next(new ServerError(ServerErrorTxt));
    });
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(NotFoundUserTxt));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(BadRequestErrorTxt),
        );
      }

      return next(new ServerError(ServerErrorTxt));
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  updateProfile,
};
