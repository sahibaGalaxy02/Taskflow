const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markOneRead,
  markAllRead,
  deleteOne,
  clearAll,
  checkOverdue,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.post('/check-overdue', checkOverdue);
router.patch('/:id/read', markOneRead);
router.delete('/:id', deleteOne);
router.delete('/', clearAll);

module.exports = router;
