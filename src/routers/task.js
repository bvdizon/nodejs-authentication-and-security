const express = require('express');
const router = new express.Router();

const Task = require('../models/task');

// endpoint for creating tasks
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// endpoint for fetching tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(202).send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// endpoint for fetching a single task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).send("You don't have a task with that ID.");
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// endpoint for updating a task
router.patch('/tasks/:id', async (req, res) => {
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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task)
      return res
        .status(400)
        .send({ error: "We don't have a task with that ID." });

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// endpoint for deleting a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(400).send({ error: 'Task ID not found.' });
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
