const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/attendanceController');

router.use(authenticate);
router.get('/', c.getAll);
router.get('/monthly', c.getMonthlyReport);
router.post('/check-in', c.checkIn);
router.post('/check-out', c.checkOut);

// Leave routes
router.get('/leaves', c.getLeaves);
router.post('/leaves', c.applyLeave);
router.patch('/leaves/:id/status', c.updateLeaveStatus);

module.exports = router;
