

const ChatMessage = require('../models/chatMessage ');

const getChatMessages = async (req, res) => {
  const { projectId } = req.params;

  try {
    const messages = await ChatMessage.find({ projectId })
      .populate('sender', 'email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const saveChatMessage = async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;

  try {
    const chatMessage = await ChatMessage.create({
      projectId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await chatMessage
      .populate('sender', 'email')
      .execPopulate();

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: 'Invalid message data', error: error.message });
  }
};

module.exports = { getChatMessages, saveChatMessage };
