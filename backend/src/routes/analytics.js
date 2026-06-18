const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/analyticsController');

router.use(authenticate);
router.get('/executive', c.getExecutiveDashboard);
router.get('/recruitment', c.getRecruitmentAnalytics);
router.get('/attendance', c.getAttendanceAnalytics);
router.get('/payroll', c.getPayrollAnalytics);

module.exports = router;
