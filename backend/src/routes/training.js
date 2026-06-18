const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/trainingController');

router.use(authenticate);
router.get('/batches', c.getBatches);
router.post('/batches', c.createBatch);
router.put('/batches/:id', c.updateBatch);
router.get('/calendar', c.getTrainingCalendar);
router.get('/skill-matrix', c.getSkillMatrix);

module.exports = router;
