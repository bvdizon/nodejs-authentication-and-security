const mongoose = require('mongoose');

// new Schema for tasks
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// middleware to before saving task documents
taskSchema.pre('save', async function (next) {
  const task = this;
  console.log(task);
  next();
});

// mongoose model - Task
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
