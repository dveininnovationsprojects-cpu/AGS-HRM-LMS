const { Course, Enrollment, Employee } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

const getCourses = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { category, status, search } = req.query;
    const where = { org_id: req.user.org_id };
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };
    const { rows, count } = await Course.findAndCountAll({ where, limit, offset, order: [['created_at', 'DESC']] });
    return successResponse(res, { courses: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!course) return errorResponse(res, 'Course not found', 404);
    return successResponse(res, { course });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, org_id: req.user.org_id, created_by: req.user.id });
    return successResponse(res, { course }, 'Course created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!course) return errorResponse(res, 'Course not found', 404);
    await course.update(req.body);
    return successResponse(res, { course }, 'Course updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const enrollEmployee = async (req, res) => {
  try {
    const { employee_id, course_id } = req.body;
    const existing = await Enrollment.findOne({ where: { employee_id, course_id } });
    if (existing) return errorResponse(res, 'Already enrolled', 400);
    const enrollment = await Enrollment.create({ employee_id, course_id, enrolled_by: req.user.id, status: 'Enrolled' });
    return successResponse(res, { enrollment }, 'Enrolled successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getEnrollments = async (req, res) => {
  try {
    const { employee_id, course_id, status } = req.query;
    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (course_id) where.course_id = course_id;
    if (status) where.status = status;
    const enrollments = await Enrollment.findAll({
      where,
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'category', 'duration_hours'] },
        { model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] },
      ],
      order: [['created_at', 'DESC']],
    });
    return successResponse(res, { enrollments });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return errorResponse(res, 'Enrollment not found', 404);
    const { progress_percentage, status } = req.body;
    const updates = { progress_percentage };
    if (status) updates.status = status;
    if (status === 'Completed') {
      updates.completed_at = new Date();
    }
    await enrollment.update(updates);
    return successResponse(res, { enrollment }, 'Progress updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getLmsAnalytics = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const courseStats = await sequelize.query(`
      SELECT c.title, COUNT(e.id) as enrollments,
        AVG(e.progress_percentage) as avg_progress,
        SUM(e.status = 'Completed') as completions
      FROM courses c LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.org_id = :orgId GROUP BY c.id, c.title ORDER BY enrollments DESC LIMIT 10
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const [overall] = await sequelize.query(`
      SELECT COUNT(*) as total_courses,
        (SELECT COUNT(*) FROM enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM enrollments WHERE status='Completed') as completions,
        (SELECT AVG(progress_percentage) FROM enrollments) as avg_progress
      FROM courses WHERE org_id = :orgId
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, { courseStats, overall: overall[0] || {} });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, enrollEmployee, getEnrollments, updateProgress, getLmsAnalytics };
