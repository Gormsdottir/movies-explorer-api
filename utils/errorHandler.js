module.exports.errorHandler = (err, req, res, next) => { // eslint-disable-line
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
};
