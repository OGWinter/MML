const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'radiant_music_super_secret_jwt_key_2026_xyz';
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    secret,
    { expiresIn: '7d' }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve user profile.' });
  }
};

const ensureAdminAccount = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@radiant.music';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      email: adminEmail,
      password: adminPass,
      name: 'Vinyl Master Admin',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    });
    console.log(`👑 Default admin initialized: ${adminEmail} (password: ${adminPass})`);
  }
};

module.exports = {
  login,
  getMe,
  ensureAdminAccount
};
