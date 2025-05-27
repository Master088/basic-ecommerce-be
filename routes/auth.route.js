const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  checkAccessToken,
  checkRefreshToken,
} = require('../middlewares/auth.middleware')

router.post('/login', authController.login);
router.post('/refresh',checkRefreshToken, authController.refreshToken);
router.post('/register', authController.register);
router.post('/logout',checkAccessToken, authController.logout);


module.exports = router;
