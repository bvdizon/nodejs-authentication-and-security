const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

const Task = require('../models/task');
const User = require('../models/user');

// endpoint for creating tasks
router.post('/tasks/', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// endpoint for fetching tasks for specific user
router.get('/tasks', auth, async (req, res) => {
  try {
    /**
     * Alternative: 
        const tasks = await Task.find({ owner: req.user._id });
        res.status(202).send(tasks);
     */

    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// endpoint for fetching a single task by ID
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    // using Model.findOne() and passing task id and owner
    // owner must come from the _id of the authenticated user
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task)
      return res.status(404).send("You don't have a task with that ID.");
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// endpoint for updating a task
router.patch('/tasks/:id', auth, async (req, res) => {
  // validate fields to update
  const updates = Object.keys(req.body);
  const allowedFieldsToUpdate = ['description', 'completed'];
  const isAllowedField = updates.every((update) =>
    allowedFieldsToUpdate.includes(update)
  );
  if (!isAllowedField) {
    return res
      .status(400)
      .send("You can only update  'description' and 'completed' fields. ");
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task)
      return res
        .status(400)
        .send({ error: "You don't have a task with that ID." });

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// endpoint for deleting a task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(400).send({ error: 'Task ID not found.' });

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
