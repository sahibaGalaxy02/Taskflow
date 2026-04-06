const express = require('express');
const router = express.Router();
const { createBoard, getBoards, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect); // All board routes are protected

router.post('/', createBoard);
router.get('/', getBoards);
router.delete('/:id', deleteBoard);

module.exports = router;
