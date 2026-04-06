const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // All task routes are protected

router.post('/', createTask);
router.get('/:boardId', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
