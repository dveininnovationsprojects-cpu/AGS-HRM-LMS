const { PayrollRecord, Employee } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');
const payrollService = require('../services/payrollService');
const logger = require('../utils/logger');

const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { employee_id, month, year, status } = req.query;
    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (month) where.period_month = month;
    if (year) where.period_year = year;
    if (status) where.status = status;

    const { rows, count } = await PayrollRecord.findAndCountAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] }],
      limit, offset, order: [['period_year', 'DESC'], ['period_month', 'DESC']],
    });
    return successResponse(res, { records: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getById = async (req, res) => {
  try {
    const record = await PayrollRecord.findByPk(req.params.id, {
      include: [{ model: Employee, as: 'employee' }],
    });
    if (!record) return errorResponse(res, 'Payroll record not found', 404);
    return successResponse(res, { record });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const processPayroll = async (req, res) => {
  try {
    const { month, year, employee_ids } = req.body;
    const result = await payrollService.processMonthlyPayroll(month, year, employee_ids, req.user.org_id);
    return successResponse(res, result, 'Payroll processed successfully');
  } catch (err) {
    logger.error('Payroll processing error:', err);
    return errorResponse(res, err.message, 500);
  }
};

const getPayslip = async (req, res) => {
  try {
    const record = await PayrollRecord.findByPk(req.params.id, {
      include: [{ model: Employee, as: 'employee' }],
    });
    if (!record) return errorResponse(res, 'Payslip not found', 404);
    return successResponse(res, { payslip: record });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getPayrollSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { sequelize } = require('../config/database');
    const [summary] = await sequelize.query(`
      SELECT
        COUNT(*) as total_employees,
        SUM(gross_salary) as total_gross,
        SUM(net_salary) as total_net,
        SUM(total_deductions) as total_deductions,
        AVG(net_salary) as avg_salary
      FROM payroll_records
      WHERE period_month = :month AND period_year = :year
    `, { replacements: { month, year }, type: sequelize.QueryTypes.SELECT });
    return successResponse(res, { summary: summary[0] || {} });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getAll, getById, processPayroll, getPayslip, getPayrollSummary };
