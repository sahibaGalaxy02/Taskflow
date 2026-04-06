const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title too long']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description too long'],
      default: ''
    },
    status: {
      type: String,
      enum: ['todo', 'doing', 'done'],
      default: 'todo'
    },
    dueDate: {
      type: Date,
      default: null
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
