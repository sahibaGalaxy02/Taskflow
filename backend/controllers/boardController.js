const Board = require('../models/Board');
const Task = require('../models/Task');
const { createNotification } = require('../services/notificationService');

const BOARD_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#0ea5e9', '#3b82f6'
];

// POST /api/boards
const createBoard = async (req, res) => {
  try {
    const { title, color } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Board title is required.' });
    }
    const randomColor = BOARD_COLORS[Math.floor(Math.random() * BOARD_COLORS.length)];
    const board = await Board.create({
      title: title.trim(),
      userId: req.user._id,
      color: color || randomColor
    });
    await createNotification({
      userId: req.user._id,
      type: 'board_created',
      title: 'Board Created',
      message: 'You created a new board: "' + board.title + '".',
      meta: { boardId: board._id, boardTitle: board.title },
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create board.' });
  }
};

// GET /api/boards
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const boardsWithCount = await Promise.all(
      boards.map(async (board) => {
        const taskCount = await Task.countDocuments({ boardId: board._id });
        return { ...board.toObject(), taskCount };
      })
    );
    res.json(boardsWithCount);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch boards.' });
  }
};

// DELETE /api/boards/:id
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.user._id });
    if (!board) {
      return res.status(404).json({ message: 'Board not found.' });
    }
    const taskCount = await Task.countDocuments({ boardId: board._id });
    await Task.deleteMany({ boardId: board._id });
    await board.deleteOne();
    await createNotification({
      userId: req.user._id,
      type: 'board_deleted',
      title: 'Board Deleted',
      message: 'Board "' + board.title + '" and its ' + taskCount + ' task' + (taskCount !== 1 ? 's' : '') + ' were deleted.',
      meta: { boardTitle: board.title },
    });
    res.json({ message: 'Board and all its tasks deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete board.' });
  }
};

module.exports = { createBoard, getBoards, deleteBoard };
