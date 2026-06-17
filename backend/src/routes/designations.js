const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { Designation } = require('../models');
const { successResponse, errorResponse } = require('../utils/helpers');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const where = { is_active: 1 };
    if (req.query.dept_id) where.dept_id = req.query.dept_id;
    const desigs = await Designation.findAll({ where, order: [['title', 'ASC']] });
    return successResponse(res, { designations: desigs });
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.post('/', async (req, res) => {
  try {
    const desig = await Designation.create(req.body);
    return successResponse(res, { designation: desig }, 'Designation created', 201);
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.put('/:id', async (req, res) => {
  try {
    const desig = await Designation.findByPk(req.params.id);
    if (!desig) return errorResponse(res, 'Not found', 404);
    await desig.update(req.body);
    return successResponse(res, { designation: desig });
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.delete('/:id', async (req, res) => {
  try {
    const desig = await Designation.findByPk(req.params.id);
    if (!desig) return errorResponse(res, 'Not found', 404);
    await desig.update({ is_active: 0 });
    return successResponse(res, {}, 'Deleted');
  } catch (err) { return errorResponse(res, err.message, 500); }
});

module.exports = router;
