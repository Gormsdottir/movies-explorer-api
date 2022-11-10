require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/cards');
const { errorHandler } = require('./utils/errorHandler');
const ErrorNotFound = require('./errors/ErrorNotFound');

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use(cors({
  origin: ['https://gormsdottir.mesto.nomoredomains.sbs',
    'http://gormsdottir.mesto.nomoredomains.sbs'],
  credentials: true,
}));

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(userRouter);
app.use(movieRouter);

app.use((req, res, next) => {
  next(new ErrorNotFound('Введен неправильный путь'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});