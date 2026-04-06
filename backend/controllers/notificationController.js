const Notification = require('../models/Notification');
const Task = require('../models/Task');
const Board = require('../models/Board');
const { createNotification } = require('../services/notificationService');

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

// PATCH /api/notifications/:id/read
const markOneRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found.' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification.' });
  }
};

// PATCH /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notifications as read.' });
  }
};

// DELETE /api/notifications/:id
const deleteOne = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Notification deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification.' });
  }
};

// DELETE /api/notifications
const clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'All notifications cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear notifications.' });
  }
};

// POST /api/notifications/check-overdue
// Called on demand (or can be scheduled) — checks all user tasks for overdue
const checkOverdue = async (req, res) => {
  try {
    const now = new Date();

    // Find all boards owned by this user
    const boards = await Board.find({ userId: req.user._id });
    const boardIds = boards.map((b) => b._id);
    const boardMap = Object.fromEntries(boards.map((b) => [b._id.toString(), b.title]));

    // Find overdue tasks not yet done
    const overdueTasks = await Task.find({
      boardId: { $in: boardIds },
      status: { $ne: 'done' },
      dueDate: { $lt: now },
    });

    let created = 0;
    for (const task of overdueTasks) {
      // Only create if we haven't already notified about this task today
      const alreadyNotified = await Notification.findOne({
        userId: req.user._id,
        type: 'task_overdue',
        'meta.taskId': task._id,
        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
      });

      if (!alreadyNotified) {
        await createNotification({
          userId: req.user._id,
          type: 'task_overdue',
          title: '⚠️ Task Overdue',
          message: `"${task.title}" was due on ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} and is still not done.`,
          meta: {
            boardId: task.boardId,
            boardTitle: boardMap[task.boardId.toString()] || 'Unknown Board',
            taskId: task._id,
            taskTitle: task.title,
          },
        });
        created++;
      }
    }

    res.json({ checked: overdueTasks.length, created });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check overdue tasks.' });
  }
};

module.exports = { getNotifications, markOneRead, markAllRead, deleteOne, clearAll, checkOverdue };
