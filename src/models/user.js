// required modules
const mongoose = require('mongoose');
const validator = require('validator');

// mongoose model - User
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please provide a valid email.');
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password must not include the phrase "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    trim: 0,
    validate(value) {
      if (value < 0) throw new Error('Age must be a positive number.');
    },
  },
});

module.exports = User;
