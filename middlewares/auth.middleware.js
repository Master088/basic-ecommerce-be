const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.util'); // Ensure you have logger.util or replace with console
const {
  jwtAccessTokenKey,
  jwtRefreshTokenKey,
} = require('../config/app.config')
/**
 * Helper to extract token from Authorization header
 */
function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

/**
 * Middleware to check Access Token
 */
function checkAccessToken(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
 
    if (!token) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      return res.status(401).send('Unauthorized');
    }

    const decoded = jwt.verify(token, jwtAccessTokenKey);
    if (!decoded) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      return res.status(401).send('Unauthorized');
    }

    req.locals = req.locals || {};
    req.locals.user = { id: decoded.id }; // or decoded.sub depending on token structure
    req.locals.token = {
      value: token,
      exp: decoded.exp,
    };

    return next();
  } catch (err) {
    logger.error(err.message || err);
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).send('Unauthorized');
  }
}

/**
 * Optional Access Token check (used for public routes with optional auth)
 */
function checkAccessTokenOptional(req, res, next) {
  const token = getTokenFromHeader(req);
  if (token) {
    return checkAccessToken(req, res, next);
  }
  return next();
}

/**
 * Middleware to check Refresh Token
 */
function checkRefreshToken(req, res, next) {
  try {
    res.setHeader('Cache-Control', 'no-store');

    const token =
      getTokenFromHeader(req);

    if (!token) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      return res.status(401).send('Unauthorized');
    }
 
    const decoded = jwt.verify(token, jwtRefreshTokenKey);
 
    if (!decoded) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      return res.status(401).send('Unauthorized');
    }

    req.locals = req.locals || {};
    req.locals.user = { id: decoded.id }; // or decoded.sub
    req.locals.token = {
      value: token,
      exp: decoded.exp,
    };

    return next();
  } catch (err) {
    logger.error(err.message || err);
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).send('Unauthorized');
  }
}

module.exports = {
  getTokenFromHeader,
  checkAccessToken,
  checkAccessTokenOptional,
  checkRefreshToken,
};
