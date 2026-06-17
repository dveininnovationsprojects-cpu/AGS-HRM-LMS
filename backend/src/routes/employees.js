const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const c = require('../controllers/employeeController');

router.use(authenticate);
router.get('/', c.getAll);
router.get('/stats', c.getStats);
router.get('/:id', c.getById);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
