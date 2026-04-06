const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title too long']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    color: {
      type: String,
      default: '#6366f1'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
