const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models'); // Assuming RefreshToken model for refresh tokens

const {
  generateAccessToken,
  generateRefreshToken
} = require('../utils/jwt.util'); 

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    // DO NOT hash password here
    // let hashedPassword = await bcrypt.hash(password, 10);

    // Create user with plain password, model hook will hash it
    const user = await User.create({
      name,
      email,
      password, // <-- pass plain password here
      address,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, address:user.address },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};


// Login user and generate tokens
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Invalid email or password' });

    // Use the model method to compare password
    const validPassword = await user.validatePassword(password);
    if (!validPassword)
      return res.status(40).json({ message: 'Invalid email or password' });

    // Generate tokens and respond as before
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({ token: refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, address:user.address, role:user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};


// Refresh access token using refresh token
exports.refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const storedToken = await RefreshToken.findOne({
      where: {
        token,
        revokedAt: null, // Only use valid (non-revoked) tokens
      },
    });

    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_KEY, async (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      const accessToken = generateAccessToken({ id: user.id, email: user.email });
      return res.json({ accessToken });
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ message: 'Could not refresh token' });
  }
};

// Logout user and delete refresh token
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify access token to extract user info
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid access token' });

      // Revoke all active refresh tokens for the user
      await RefreshToken.update(
        { revokedAt: new Date() },
        {
          where: {
            userId: decoded.id,
            revokedAt: null,
          },
        }
      );

      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
};
