const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const getExecutiveDashboard = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const [empStats] = await sequelize.query(`
      SELECT COUNT(*) as total, SUM(employment_status='Active') as active,
        SUM(employment_status='Resigned') as resigned,
        SUM(DATEDIFF(CURDATE(), date_of_joining) <= 30) as new_joiners
      FROM employees WHERE org_id = :orgId
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const [attendanceStats] = await sequelize.query(`
      SELECT AVG(work_hours) as avg_hours, SUM(status='Present') as present_today,
        SUM(status='Absent') as absent_today
      FROM attendance_records WHERE attendance_date = CURDATE()
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });

    const [payrollStats] = await sequelize.query(`
      SELECT SUM(net_salary) as total_payroll, AVG(net_salary) as avg_salary
      FROM payroll_records WHERE month = MONTH(CURDATE()) AND year = YEAR(CURDATE())
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });

    const [lmsStats] = await sequelize.query(`
      SELECT COUNT(*) as total_courses,
        (SELECT COUNT(*) FROM enrollments) as enrollments,
        (SELECT SUM(status='Completed') FROM enrollments) as completions
      FROM courses WHERE org_id = :orgId
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const deptChart = await sequelize.query(`
      SELECT d.name, COUNT(e.id) as count
      FROM departments d LEFT JOIN employees e ON e.dept_id = d.id AND e.employment_status='Active'
      WHERE d.org_id = :orgId GROUP BY d.id, d.name ORDER BY count DESC LIMIT 8
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const monthlyJoiners = await sequelize.query(`
      SELECT DATE_FORMAT(date_of_joining, '%b %Y') as month, COUNT(*) as count
      FROM employees WHERE org_id = :orgId AND date_of_joining >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(date_of_joining, '%Y-%m') ORDER BY date_of_joining ASC
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, {
      employees: empStats[0] || {},
      attendance: attendanceStats[0] || {},
      payroll: payrollStats[0] || {},
      lms: lmsStats[0] || {},
      departmentChart: deptChart,
      monthlyJoiners,
    });
  } catch (err) {
    logger.error('Executive dashboard error:', err);
    return errorResponse(res, err.message, 500);
  }
};

const getRecruitmentAnalytics = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const funnel = await sequelize.query(`
      SELECT current_stage, COUNT(*) as count
      FROM candidates c
      JOIN job_requisitions jr ON c.requisition_id = jr.id
      WHERE jr.org_id = :orgId GROUP BY current_stage
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const [sourceStats] = await sequelize.query(`
      SELECT source, COUNT(*) as count FROM candidates c
      JOIN job_requisitions jr ON c.requisition_id = jr.id
      WHERE jr.org_id = :orgId GROUP BY source
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const openPositions = await sequelize.query(`
      SELECT title, dept_id, openings, req_number, created_at FROM job_requisitions
      WHERE org_id = :orgId AND status = 'Open' ORDER BY created_at DESC LIMIT 10
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, { funnel, sourceStats, openPositions });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getAttendanceAnalytics = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const weekly = await sequelize.query(`
      SELECT attendance_date, SUM(status='Present') as present,
        SUM(status='Absent') as absent, SUM(status='Late') as late,
        AVG(work_hours) as avg_hours
      FROM attendance_records
      WHERE attendance_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY attendance_date ORDER BY attendance_date ASC
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });

    const leaveBreakdown = await sequelize.query(`
      SELECT leave_type, COUNT(*) as count, SUM(status='Approved') as approved
      FROM leave_requests GROUP BY leave_type
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, { weekly, leaveBreakdown });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getPayrollAnalytics = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const monthly = await sequelize.query(`
      SELECT period_month as month, period_year as year,
        SUM(gross_salary) as gross, SUM(net_salary) as net,
        SUM(total_deductions) as deductions, COUNT(*) as headcount
      FROM payroll_records GROUP BY period_year, period_month ORDER BY period_year DESC, period_month DESC LIMIT 12
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, { monthly });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getExecutiveDashboard, getRecruitmentAnalytics, getAttendanceAnalytics, getPayrollAnalytics };
