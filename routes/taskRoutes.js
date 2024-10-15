const express = require('express');
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { roleAuthorization } = require('../middleware/roleMiddleware');

const router = express.Router();

// @route   POST /api/tasks
router.post('/', protect, createTask);

// @route   GET /api/tasks
router.get('/', protect, getTasks);

// @route   PUT /api/tasks/:id
router.put('/:id', protect, updateTask);

// @route   DELETE /api/tasks/:id
router.delete('/:id', protect, deleteTask);

module.exports = router;
