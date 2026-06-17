const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

router.use(authenticate);
router.get('/stats', getStats);

module.exports = router;
