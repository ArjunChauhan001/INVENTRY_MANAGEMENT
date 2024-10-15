const express = require('express');
const {
  getChatMessages,
  saveChatMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/chat/:projectId
router.get('/:projectId', protect, getChatMessages);

// @route   POST /api/chat/:projectId
router.post('/:projectId', protect, saveChatMessage);

module.exports = router;
