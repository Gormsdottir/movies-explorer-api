const { NotFoundError } = require('./NotFoundError');

module.exports.pageNotFound = (req, res, next) => {
  next(
    new NotFoundError('Страница не найдена'),
  );
};
