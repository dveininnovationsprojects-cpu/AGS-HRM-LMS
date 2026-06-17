const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { Department } = require('../models');
const { successResponse, errorResponse } = require('../utils/helpers');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const depts = await Department.findAll({ where: { org_id: req.user.org_id, is_active: 1 }, order: [['name', 'ASC']] });
    return successResponse(res, { departments: depts });
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.get('/:id', async (req, res) => {
  try {
    const dept = await Department.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!dept) return errorResponse(res, 'Department not found', 404);
    return successResponse(res, { department: dept });
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.post('/', async (req, res) => {
  try {
    const dept = await Department.create({ ...req.body, org_id: req.user.org_id });
    return successResponse(res, { department: dept }, 'Department created', 201);
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.put('/:id', async (req, res) => {
  try {
    const dept = await Department.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!dept) return errorResponse(res, 'Department not found', 404);
    await dept.update(req.body);
    return successResponse(res, { department: dept }, 'Updated');
  } catch (err) { return errorResponse(res, err.message, 500); }
});

router.delete('/:id', async (req, res) => {
  try {
    const dept = await Department.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!dept) return errorResponse(res, 'Department not found', 404);
    await dept.update({ is_active: 0 });
    return successResponse(res, {}, 'Deleted');
  } catch (err) { return errorResponse(res, err.message, 500); }
});

module.exports = router;
