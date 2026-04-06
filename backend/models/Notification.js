const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['task_created', 'task_updated', 'task_deleted', 'task_overdue', 'task_moved', 'board_created', 'board_deleted'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    meta: {
      boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', default: null },
      boardTitle: { type: String, default: null },
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
      taskTitle: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model('Notification', notificationSchema);
