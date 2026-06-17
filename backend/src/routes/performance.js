const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/performanceController');

router.use(authenticate);
router.get('/', c.getReviews);
router.get('/kpi', c.getKpiSummary);
router.get('/:id', c.getReviewById);
router.post('/', c.createReview);
router.put('/:id', c.updateReview);

module.exports = router;
