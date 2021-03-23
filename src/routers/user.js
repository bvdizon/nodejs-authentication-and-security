const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');

// endpoint for creating users
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// endpoint for user login
router.post('/users/login', async (req, res) => {
  try {
    // setting reusable function "findByCredentials( )" --- this function will be created in models/user.js
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    // call to custom fx to generate token
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send('Error');
  }
});

// endpoint for logging out user
router.post('/users/logout', auth, async ({ user, token }, res) => {
  try {
    user.tokens = user.tokens.filter((item) => {
      return item.token !== token;
    });

    await user.save();

    res.send('You are now logged off.');
  } catch (error) {
    res.status(500).send('Unable to perform logout action.');
  }
});

// endpoint for logging user out on all devices
router.post('/users/logoutAll', auth, async ({ user }, res) => {
  try {
    user.tokens = [];

    await user.save();

    res.send('You have been logged on all devices.');
  } catch (error) {
    res.status(500).send('Unable to log you off on all devices.');
  }
});

// endpoint for logging in and authenticating a user from mongoDB
router.get('/users/me', auth, async (req, res) => {
  res.send({ user: req.user, token: req.token });
});

// endpoint for getting ( reading ) one user from mongoDB
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("Can't find a user with that ID.");
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// endpoints for updating a single user
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedFieldsToUpdate = ['name', 'age', 'email', 'password'];
  const isAllowedField = updates.every((update) =>
    allowedFieldsToUpdate.includes(update)
  );

  if (!isAllowedField) return res.send({ error: 'Failed to update user.' });

  try {
    // create a variable to save user document
    const user = await User.findById(req.params.id);

    // itirate over the updates and access property dynamically
    updates.forEach((update) => (user[update] = req.body[update]));

    // save the changes to db
    await user.save();

    // error handling
    if (!user) return res.status(400).send();

    // success handling
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// endpoint for deleting a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(400).send({ error: "User ID doesn't exist." });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
