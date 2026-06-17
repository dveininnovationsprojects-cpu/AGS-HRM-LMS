const { PerformanceReview, Employee } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');

const getReviews = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { employee_id, status, review_period } = req.query;
    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (status) where.status = status;
    if (review_period) where.review_period = review_period;
    const { rows, count } = await PerformanceReview.findAndCountAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] }],
      limit, offset, order: [['created_at', 'DESC']],
    });
    return successResponse(res, { reviews: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await PerformanceReview.findByPk(req.params.id, {
      include: [{ model: Employee, as: 'employee' }],
    });
    if (!review) return errorResponse(res, 'Review not found', 404);
    return successResponse(res, { review });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createReview = async (req, res) => {
  try {
    const review = await PerformanceReview.create({ ...req.body, reviewed_by: req.user.id });
    return successResponse(res, { review }, 'Performance review created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await PerformanceReview.findByPk(req.params.id);
    if (!review) return errorResponse(res, 'Review not found', 404);
    await review.update(req.body);
    return successResponse(res, { review }, 'Review updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getKpiSummary = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;
    const kpis = await sequelize.query(`
      SELECT
        AVG(overall_rating) as avg_rating,
        COUNT(*) as total_reviews,
        SUM(status = 'Completed') as completed,
        SUM(overall_rating >= 4) as high_performers,
        SUM(overall_rating < 2.5) as low_performers
      FROM performance_reviews pr
      JOIN employees e ON pr.employee_id = e.id
      WHERE e.org_id = :orgId
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const ratingDist = await sequelize.query(`
      SELECT ROUND(overall_rating) as rating, COUNT(*) as count
      FROM performance_reviews pr
      JOIN employees e ON pr.employee_id = e.id
      WHERE e.org_id = :orgId
      GROUP BY ROUND(overall_rating)
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, { kpis: kpis[0] || {}, ratingDistribution: ratingDist });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getReviews, getReviewById, createReview, updateReview, getKpiSummary };
