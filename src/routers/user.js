const express = require('express');
const router = new express.Router();

const User = require('../models/user');

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

// endpoint for getting ( reading ) users from mongoDB
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
