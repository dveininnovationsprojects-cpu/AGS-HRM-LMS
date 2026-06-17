const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const getStats = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const [employees] = await sequelize.query(`
      SELECT COUNT(*) as total,
        SUM(employment_status='Active') as active,
        SUM(employment_status='Resigned') as resigned,
        SUM(DATEDIFF(CURDATE(), date_of_joining) <= 30) as new_this_month
      FROM employees WHERE org_id = :orgId
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const [attendance] = await sequelize.query(`
      SELECT SUM(status='Present') as present, SUM(status='Absent') as absent,
        SUM(status='Late') as late, AVG(work_hours) as avg_hours
      FROM attendance_records WHERE attendance_date = CURDATE()
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });

    const [openJobs] = await sequelize.query(`
      SELECT COUNT(*) as count FROM job_requisitions WHERE org_id = :orgId AND status = 'Open'
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const [pendingLeaves] = await sequelize.query(`
      SELECT COUNT(*) as count FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      WHERE e.org_id = :orgId AND lr.status = 'Pending'
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const [lms] = await sequelize.query(`
      SELECT COUNT(*) as courses FROM courses WHERE org_id = :orgId AND status = 'Published'
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const recentActivity = await sequelize.query(`
      SELECT 'New Employee' as type, CONCAT(first_name, ' ', last_name) as description, date_of_joining as date
      FROM employees WHERE org_id = :orgId ORDER BY date_of_joining DESC LIMIT 5
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, {
      kpis: {
        totalEmployees: employees[0]?.total || 0,
        activeEmployees: employees[0]?.active || 0,
        newJoinees: employees[0]?.new_this_month || 0,
        presentToday: attendance[0]?.present || 0,
        absentToday: attendance[0]?.absent || 0,
        openPositions: openJobs[0]?.count || 0,
        pendingLeaves: pendingLeaves[0]?.count || 0,
        activeCourses: lms[0]?.courses || 0,
      },
      recentActivity,
    });
  } catch (err) {
    logger.error('Dashboard stats error:', err);
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getStats };
