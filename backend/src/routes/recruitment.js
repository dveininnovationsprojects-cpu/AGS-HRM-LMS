const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/recruitmentController');

router.use(authenticate);
router.get('/requisitions', c.getRequisitions);
router.post('/requisitions', c.createRequisition);
router.put('/requisitions/:id', c.updateRequisition);
router.get('/candidates', c.getCandidates);
router.post('/candidates', c.createCandidate);
router.patch('/candidates/:id/stage', c.updateCandidateStage);
router.get('/funnel', c.getRecruitmentFunnel);

module.exports = router;
