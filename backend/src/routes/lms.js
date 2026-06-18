const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/lmsController');

router.use(authenticate);
router.get('/courses', c.getCourses);
router.get('/courses/:id', c.getCourseById);
router.post('/courses', c.createCourse);
router.put('/courses/:id', c.updateCourse);
router.post('/enroll', c.enrollEmployee);
router.get('/enrollments', c.getEnrollments);
router.patch('/enrollments/:id/progress', c.updateProgress);
router.get('/analytics', c.getLmsAnalytics);

module.exports = router;
