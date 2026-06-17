const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/aiController');

router.use(authenticate);
router.get('/insights', c.getWorkforceInsights);
router.get('/attrition', c.getAttritionPrediction);
router.get('/training-recommendations/:employee_id', c.getTrainingRecommendations);
router.get('/hiring-recommendations', c.getHiringRecommendations);
router.post('/chat', c.chat);

module.exports = router;
