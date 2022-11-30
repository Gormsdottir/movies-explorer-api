const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { Unauthorized } = require('../utils/Unauthorized');
const { UnauthorizedErrTxt } = require('../utils/error-messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function fn(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized(UnauthorizedErrTxt);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Unauthorized(UnauthorizedErrTxt);
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
