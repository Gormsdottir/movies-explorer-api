const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../utils/NotFoundError');

const {
  createUserValid,
  loginValid,
} = require('../validators/auth');

const {
  createUser,
  login,
} = require('../controllers/users');

router.post(
  '/signup',
  createUserValid,
  createUser,
);
router.post(
  '/signin',
  loginValid,
  login,
);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
