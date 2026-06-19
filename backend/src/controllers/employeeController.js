const { Op } = require('sequelize');
const { Employee, Department, Designation, User } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta, generateEmpCode } = require('../utils/helpers');
const logger = require('../utils/logger');

const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { search, dept_id, status, employment_type, work_country, work_branch } = req.query;

    const where = { org_id: req.user.org_id };
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { emp_code: { [Op.like]: `%${search}%` } },
        { work_email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (dept_id) where.dept_id = dept_id;
    if (status) where.employment_status = status;
    if (employment_type) where.employment_type = employment_type;
    if (work_country) where.work_country = work_country;
    if (work_branch) where.work_branch = work_branch;

    const { rows, count } = await Employee.findAndCountAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Designation, as: 'designation', attributes: ['id', 'name'] },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return successResponse(res, {
      employees: rows,
      pagination: buildPaginationMeta(count, page, limit),
    });
  } catch (err) {
    logger.error('getAll employees error:', err);
    return errorResponse(res, err.message, 500);
  }
};

const getById = async (req, res) => {
  try {
    const emp = await Employee.findOne({
      where: { id: req.params.id, org_id: req.user.org_id },
      include: [
        { model: Department, as: 'department' },
        { model: Designation, as: 'designation' },
        { model: Employee, as: 'manager', attributes: ['id', 'first_name', 'last_name', 'emp_code'] },
      ],
    });
    if (!emp) return errorResponse(res, 'Employee not found', 404);
    return successResponse(res, { employee: emp });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const create = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const [result] = await sequelize.query(
      'SELECT COUNT(*) as cnt FROM employees WHERE org_id = :orgId',
      { replacements: { orgId: req.user.org_id }, type: sequelize.QueryTypes.SELECT }
    );
    const seq = (result.cnt || 0) + 1;
    const emp_code = generateEmpCode('AGS', seq);

    const emp = await Employee.create({
      ...req.body,
      org_id: req.user.org_id,
      emp_code,
      created_by: req.user.id,
    });

    return successResponse(res, { employee: emp }, 'Employee created successfully', 201);
  } catch (err) {
    logger.error('create employee error:', err);
    return errorResponse(res, err.message, 500);
  }
};

const update = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!emp) return errorResponse(res, 'Employee not found', 404);
    await emp.update(req.body);
    return successResponse(res, { employee: emp }, 'Employee updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const remove = async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!emp) return errorResponse(res, 'Employee not found', 404);
    await emp.update({ is_active: 0, employment_status: 'Inactive' });
    return successResponse(res, {}, 'Employee deactivated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getStats = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const orgId = req.user.org_id;

    const [stats] = await sequelize.query(`
      SELECT
        COUNT(*) as total,
        SUM(employment_status = 'Active') as active,
        SUM(employment_status = 'Resigned') as resigned,
        SUM(employment_type = 'Full-Time') as full_time,
        SUM(employment_type = 'Contract') as contract,
        SUM(employment_type = 'Intern') as interns
      FROM employees WHERE org_id = :orgId
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    const deptDist = await sequelize.query(`
      SELECT d.name, COUNT(e.id) as count
      FROM employees e JOIN departments d ON e.dept_id = d.id
      WHERE e.org_id = :orgId AND e.employment_status='Active'
      GROUP BY d.id, d.name ORDER BY count DESC LIMIT 10
    `, { replacements: { orgId }, type: sequelize.QueryTypes.SELECT });

    return successResponse(res, { stats: stats[0] || {}, departmentDistribution: deptDist });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getAll, getById, create, update, remove, getStats };
