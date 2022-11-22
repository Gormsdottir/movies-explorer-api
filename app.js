require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { hostDB } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./utils/errorHandler');
const limiter = require('./middlewares/rate-limiter');

const app = express();

app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.use(cors({
  origin: ['https://gormsdottir.diploma.nomoredomains.icu',
    'http://gormsdottir.diploma.nomoredomains.icu',
    'http://localhost:3001'],
  credentials: true,
}));

const { PORT = 3000 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;

app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : hostDB, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(limiter);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
