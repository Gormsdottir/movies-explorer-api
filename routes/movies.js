const router = require('express').Router();
const {
  createMovieValid,
  deleteMovieValid,
} = require('../validators/movies');
const auth = require('../middlewares/auth');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', auth, getMovies);

router.post(
  '/movies',
  auth,
  createMovieValid,
  createMovie,
);

router.delete(
  '/movies/:movieId',
  auth,
  deleteMovieValid,
  deleteMovie,
);

module.exports = router;
