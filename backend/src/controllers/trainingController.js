const { TrainingBatch, Employee } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');

const getBatches = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status } = req.query;
    const where = { org_id: req.user.org_id };
    if (status) where.status = status;
    const { rows, count } = await TrainingBatch.findAndCountAll({ where, limit, offset, order: [['start_date', 'DESC']] });
    return successResponse(res, { batches: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createBatch = async (req, res) => {
  try {
    const batch = await TrainingBatch.create({ ...req.body, org_id: req.user.org_id, created_by: req.user.id });
    return successResponse(res, { batch }, 'Training batch created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateBatch = async (req, res) => {
  try {
    const batch = await TrainingBatch.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!batch) return errorResponse(res, 'Batch not found', 404);
    await batch.update(req.body);
    return successResponse(res, { batch }, 'Batch updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getTrainingCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { sequelize } = require('../config/database');
    const batches = await sequelize.query(`
      SELECT id, title, start_date, end_date, trainer_name, venue, max_participants, status
      FROM training_batches
      WHERE org_id = :orgId AND MONTH(start_date) = :month AND YEAR(start_date) = :year
      ORDER BY start_date ASC
    `, { replacements: { orgId: req.user.org_id, month, year }, type: sequelize.QueryTypes.SELECT });
    return successResponse(res, { calendar: batches });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getSkillMatrix = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const matrix = await sequelize.query(`
      SELECT e.id, e.first_name, e.last_name, e.emp_code,
        COUNT(en.id) as courses_enrolled,
        SUM(en.status = 'Completed') as courses_completed,
        AVG(en.progress_percentage) as avg_progress
      FROM employees e
      LEFT JOIN enrollments en ON e.id = en.employee_id
      WHERE e.org_id = :orgId AND e.is_active = 1
      GROUP BY e.id
      ORDER BY courses_completed DESC
    `, { replacements: { orgId: req.user.org_id }, type: sequelize.QueryTypes.SELECT });
    return successResponse(res, { skillMatrix: matrix });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getBatches, createBatch, updateBatch, getTrainingCalendar, getSkillMatrix };
