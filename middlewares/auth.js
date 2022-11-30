const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../utils/Unauthorized');
const { UnauthorizedTxt } = require('../utils/error-messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(UnauthorizedTxt);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new Unauthorized(UnauthorizedTxt);
  }

  req.user = payload;

  next();
};
