const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc   Get logged-in user profile
// @route  GET /api/users/profile
// @access Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('[Get User Profile Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      token,
    });
  } catch (err) {
    console.error('[Update User Profile Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};
