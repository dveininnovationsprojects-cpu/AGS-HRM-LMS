const { successResponse, errorResponse } = require('../utils/helpers');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

const getWorkforceInsights = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const [data] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM employees WHERE org_id = :orgId AND employment_status = 'Active') as active_employees,
        (SELECT COUNT(*) FROM employees WHERE org_id = :orgId AND employment_status = 'Resigned') as resigned,
        (SELECT COUNT(*) FROM employees WHERE org_id = :orgId AND DATEDIFF(CURDATE(), date_of_joining) <= 90) as new_joiners,
        (SELECT AVG(overall_rating) FROM performance_reviews pr JOIN employees e ON pr.employee_id = e.id WHERE e.org_id = :orgId) as avg_performance,
        (SELECT COUNT(*) FROM job_requisitions WHERE org_id = :orgId AND status = 'Open') as open_positions
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const insights = await aiService.generateWorkforceInsights(data[0] || {});
    return successResponse(res, { insights, rawData: data[0] });
  } catch (err) {
    logger.error('AI workforce insights error:', err);
    return errorResponse(res, 'AI service temporarily unavailable', 503);
  }
};

const getAttritionPrediction = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const employees = await sequelize.query(`
      SELECT e.id, e.first_name, e.last_name, e.emp_code,
        DATEDIFF(CURDATE(), e.date_of_joining) as tenure_days,
        AVG(pr.overall_rating) as avg_rating,
        (SELECT COUNT(*) FROM leave_requests lr WHERE lr.employee_id = e.id AND lr.status = 'Approved' AND YEAR(lr.created_at) = YEAR(CURDATE())) as leaves_taken
      FROM employees e
      LEFT JOIN performance_reviews pr ON pr.employee_id = e.id
      WHERE e.org_id = :orgId AND e.employment_status = 'Active'
      GROUP BY e.id LIMIT 50
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const predictions = await aiService.predictAttrition(employees);
    return successResponse(res, { predictions });
  } catch (err) {
    logger.error('Attrition prediction error:', err);
    return errorResponse(res, 'AI service temporarily unavailable', 503);
  }
};

const getTrainingRecommendations = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { sequelize } = require('../config/database');

    const [empData] = await sequelize.query(`
      SELECT e.first_name, e.last_name, d.name as dept, des.title as designation,
        GROUP_CONCAT(DISTINCT c.category) as completed_categories
      FROM employees e
      LEFT JOIN departments d ON e.dept_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      LEFT JOIN enrollments en ON en.employee_id = e.id AND en.status = 'Completed'
      LEFT JOIN courses c ON c.id = en.course_id
      WHERE e.id = :empId GROUP BY e.id
    `, { replacements: { empId: employee_id }, type: sequelize.QueryTypes.SELECT });

    const recommendations = await aiService.getTrainingRecommendations(empData[0] || {});
    return successResponse(res, { recommendations });
  } catch (err) {
    return errorResponse(res, 'AI service temporarily unavailable', 503);
  }
};

const getHiringRecommendations = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const [context] = await sequelize.query(`
      SELECT COUNT(*) as open_positions,
        (SELECT GROUP_CONCAT(DISTINCT title) FROM job_requisitions WHERE org_id = :orgId AND status = 'Open' LIMIT 5) as positions
      FROM job_requisitions WHERE org_id = :orgId AND status = 'Open'
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const recommendations = await aiService.getHiringRecommendations(context[0] || {});
    return successResponse(res, { recommendations });
  } catch (err) {
    return errorResponse(res, 'AI service temporarily unavailable', 503);
  }
};

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return errorResponse(res, 'Message is required', 400);
    const response = await aiService.chat(message, history);
    return successResponse(res, { response });
  } catch (err) {
    return errorResponse(res, 'AI chat unavailable', 503);
  }
};

module.exports = { getWorkforceInsights, getAttritionPrediction, getTrainingRecommendations, getHiringRecommendations, chat };
