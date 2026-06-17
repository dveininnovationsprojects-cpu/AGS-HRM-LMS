const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/attendanceController');

router.use(authenticate);
router.get('/', c.getLeaves);
router.post('/', c.applyLeave);
router.patch('/:id/status', c.updateLeaveStatus);

module.exports = router;
