const { Op } = require('sequelize');
const { AttendanceRecord, Employee, LeaveRequest } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');
const logger = require('../utils/logger');

const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { employee_id, date_from, date_to, status } = req.query;
    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (status) where.status = status;
    if (date_from || date_to) {
      where.date = {};
      if (date_from) where.date[Op.gte] = date_from;
      if (date_to) where.date[Op.lte] = date_to;
    }
    const { rows, count } = await AttendanceRecord.findAndCountAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] }],
      limit, offset, order: [['date', 'DESC']],
    });
    return successResponse(res, { records: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const checkIn = async (req, res) => {
  try {
    const { employee_id, check_in_time, location } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const existing = await AttendanceRecord.findOne({ where: { employee_id, date: today } });
    if (existing) return errorResponse(res, 'Already checked in today', 400);

    const record = await AttendanceRecord.create({
      employee_id,
      date: today,
      check_in: check_in_time || new Date(),
      status: 'Present',
    });
    return successResponse(res, { record }, 'Check-in recorded', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const checkOut = async (req, res) => {
  try {
    const { employee_id, check_out_time } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const record = await AttendanceRecord.findOne({ where: { employee_id, date: today } });
    if (!record) return errorResponse(res, 'No check-in found for today', 404);
    if (record.check_out) return errorResponse(res, 'Already checked out', 400);

    const checkIn = new Date(record.check_in);
    const checkOut = check_out_time ? new Date(check_out_time) : new Date();
    const totalHours = ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2);

    await record.update({ check_out: checkOut, total_hours: totalHours });
    return successResponse(res, { record }, 'Check-out recorded');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const { employee_id, month, year } = req.query;
    const { sequelize } = require('../config/database');
    const rows = await sequelize.query(`
      SELECT date, status, check_in, check_out, total_hours
      FROM attendance_records
      WHERE employee_id = :empId AND MONTH(date) = :month AND YEAR(date) = :year
      ORDER BY date ASC
    `, { replacements: { empId: employee_id, month, year }, type: sequelize.QueryTypes.SELECT });
    return successResponse(res, { records: rows });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// Leave Requests
const applyLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create({ ...req.body, status: 'Pending' });
    return successResponse(res, { leave }, 'Leave application submitted', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getLeaves = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { employee_id, status } = req.query;
    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (status) where.status = status;
    const { rows, count } = await LeaveRequest.findAndCountAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] }],
      limit, offset, order: [['created_at', 'DESC']],
    });
    return successResponse(res, { leaves: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leave = await LeaveRequest.findByPk(req.params.id);
    if (!leave) return errorResponse(res, 'Leave request not found', 404);
    await leave.update({ status, remarks, approved_by: req.user.id, approved_at: new Date() });
    return successResponse(res, { leave }, `Leave ${status.toLowerCase()}`);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getAll, checkIn, checkOut, getMonthlyReport, applyLeave, getLeaves, updateLeaveStatus };
