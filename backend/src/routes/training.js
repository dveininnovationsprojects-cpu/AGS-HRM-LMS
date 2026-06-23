const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/trainingController');

router.use(authenticate);
router.get('/stats', c.getTrainingStats);
router.get('/batches', c.getBatches);
router.post('/batches', c.createBatch);
router.put('/batches/:id', c.updateBatch);
router.post('/batches/:id/evaluate', c.evaluateTrainee);
router.get('/trainers', c.getTrainers);
router.post('/trainers', c.createTrainer);
router.get('/calendar', c.getTrainingCalendar);
router.get('/skill-matrix', c.getSkillMatrix);

module.exports = router;
