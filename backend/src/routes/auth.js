const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/authController');

router.post('/login', c.login);
router.post('/refresh', c.refresh);
router.post('/forgot-password', c.forgotPassword);
router.post('/reset-password', c.resetPassword);
router.post('/logout', authenticate, c.logout);
router.get('/me', authenticate, c.getMe);
router.put('/change-password', authenticate, c.changePassword);

module.exports = router;
