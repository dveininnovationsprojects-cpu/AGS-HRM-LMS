const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/payrollController');

router.use(authenticate);
router.get('/', c.getAll);
router.get('/summary', c.getPayrollSummary);
router.get('/:id', c.getById);
router.get('/:id/payslip', c.getPayslip);
router.post('/process', c.processPayroll);

module.exports = router;
