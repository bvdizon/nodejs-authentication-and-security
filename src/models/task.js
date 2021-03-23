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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // this will create a reference or relationship between task and user
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
