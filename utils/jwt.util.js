const jwt = require('jsonwebtoken');

// Generate Access Token (15 minutes)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_TOKEN_KEY,
    { expiresIn: '5m' }
  );
};

// Generate Refresh Token (7 days)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_TOKEN_KEY,
    { expiresIn: '7d' }
  );
};



module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
