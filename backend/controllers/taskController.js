const Task = require('../models/Task');
const Board = require('../models/Board');
const { createNotification } = require('../services/notificationService');

const verifyBoardOwnership = async (boardId, userId) => {
  return Board.findOne({ _id: boardId, userId });
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, boardId, priority } = req.body;
    if (!title || !boardId) {
      return res.status(400).json({ message: 'Title and boardId are required.' });
    }
    const board = await verifyBoardOwnership(boardId, req.user._id);
    if (!board) {
      return res.status(403).json({ message: 'Access denied to this board.' });
    }
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'todo',
      dueDate: dueDate || null,
      boardId,
      priority: priority || 'medium'
    });
    await createNotification({
      userId: req.user._id,
      type: 'task_created',
      title: 'Task Created',
      message: '"' + task.title + '" was added to board "' + board.title + '".',
      meta: { boardId: board._id, boardTitle: board.title, taskId: task._id, taskTitle: task.title },
    });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

// GET /api/tasks/:boardId
const getTasks = async (req, res) => {
  try {
    const board = await verifyBoardOwnership(req.params.boardId, req.user._id);
    if (!board) {
      return res.status(403).json({ message: 'Access denied to this board.' });
    }
    const tasks = await Task.find({ boardId: req.params.boardId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    const board = await verifyBoardOwnership(task.boardId, req.user._id);
    if (!board) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const { title, description, status, dueDate, priority } = req.body;
    const oldStatus = task.status;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (priority !== undefined) task.priority = priority;
    await task.save();

    // Notify on status change (move between columns)
    if (status !== undefined && status !== oldStatus) {
      const statusLabels = { todo: 'To Do', doing: 'In Progress', done: 'Done' };
      await createNotification({
        userId: req.user._id,
        type: 'task_moved',
        title: 'Task Moved',
        message: '"' + task.title + '" moved from ' + statusLabels[oldStatus] + ' to ' + statusLabels[status] + '.',
        meta: { boardId: board._id, boardTitle: board.title, taskId: task._id, taskTitle: task.title },
      });
    } else if (title !== undefined || description !== undefined || priority !== undefined || dueDate !== undefined) {
      await createNotification({
        userId: req.user._id,
        type: 'task_updated',
        title: 'Task Updated',
        message: '"' + task.title + '" was updated in board "' + board.title + '".',
        meta: { boardId: board._id, boardTitle: board.title, taskId: task._id, taskTitle: task.title },
      });
    }

    res.json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    const board = await verifyBoardOwnership(task.boardId, req.user._id);
    if (!board) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const taskTitle = task.title;
    await task.deleteOne();
    await createNotification({
      userId: req.user._id,
      type: 'task_deleted',
      title: 'Task Deleted',
      message: '"' + taskTitle + '" was removed from board "' + board.title + '".',
      meta: { boardId: board._id, boardTitle: board.title, taskTitle },
    });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
