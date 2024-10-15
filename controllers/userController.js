
const User = require('../models/user');

const assignUserRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!['ADMIN', 'USER'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      user.role = role;
      await user.save();

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { assignUserRole };
