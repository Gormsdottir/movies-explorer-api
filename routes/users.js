const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUser,
  updateProfile,
} = require('../controllers/users');

const {
  updateProfileValid,
} = require('../validators/users');

router.get(
  '/users/me',
  auth,
  getUser,
);

router.patch(
  '/users/me',
  auth,
  updateProfileValid,
  updateProfile,
);

module.exports = router;
