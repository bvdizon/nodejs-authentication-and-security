// required modules
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// instantiating a mongoose Schema object for User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please provide a valid email.');
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
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

// custom function that will find a user in db
userSchema.statics.findByCredentials = async (email, password) => {
  // find the user with the supplied email
  const user = await User.findOne({ email });

  if (!user) throw new Error('Unable to login.');

  // compare hashed passwords
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Unable to login with those credentials');

  return user;
};

// adding middleware to hash pw before saving to db, hence "pre"
userSchema.pre('save', async function (next) {
  // storing the document being saved as a variable
  const user = this;

  // hash the password with bcryptjs if password is either created or modified
  if (user.isModified) {
    user['password'] = await bcrypt.hash(user['password'], 8);
  }

  console.log(user);

  next(); // passing control to the next matching route
});

// mongoose model - User
const User = mongoose.model('User', userSchema);

module.exports = User;
