const { Op } = require('sequelize');
const { JobRequisition, Candidate } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');
const logger = require('../utils/logger');

// Job Requisitions
const getRequisitions = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status, dept_id } = req.query;
    const where = { org_id: req.user.org_id };
    if (status) where.status = status;
    if (dept_id) where.dept_id = dept_id;
    const { rows, count } = await JobRequisition.findAndCountAll({ where, limit, offset, order: [['created_at', 'DESC']] });
    return successResponse(res, { requisitions: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createRequisition = async (req, res) => {
  try {
    const req_number = `JR-${Date.now()}`;
    const jrn = await JobRequisition.create({ ...req.body, org_id: req.user.org_id, req_number, requested_by: req.user.id });
    return successResponse(res, { requisition: jrn }, 'Job requisition created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateRequisition = async (req, res) => {
  try {
    const jr = await JobRequisition.findOne({ where: { id: req.params.id, org_id: req.user.org_id } });
    if (!jr) return errorResponse(res, 'Job requisition not found', 404);
    await jr.update(req.body);
    return successResponse(res, { requisition: jr }, 'Requisition updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// Candidates
const getCandidates = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { requisition_id, stage, search } = req.query;
    const where = {};
    if (requisition_id) where.requisition_id = requisition_id;
    if (stage) where.current_stage = stage;
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    const { rows, count } = await Candidate.findAndCountAll({
      where,
      include: [{ model: JobRequisition, as: 'requisition', attributes: ['id', 'title', 'req_number'] }],
      limit, offset, order: [['created_at', 'DESC']],
    });
    return successResponse(res, { candidates: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create({ ...req.body, created_by: req.user.id });
    return successResponse(res, { candidate }, 'Candidate added', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateCandidateStage = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return errorResponse(res, 'Candidate not found', 404);
    await candidate.update({ current_stage: req.body.stage, stage_notes: req.body.notes });
    return successResponse(res, { candidate }, 'Stage updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getRecruitmentFunnel = async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    const funnel = await sequelize.query(`
      SELECT current_stage, COUNT(*) as count
      FROM candidates
      WHERE requisition_id IN (SELECT id FROM job_requisitions WHERE org_id = :orgId)
      GROUP BY current_stage
    `, { replacements: { orgId: req.user.org_id }, type: sequelize.QueryTypes.SELECT });
    return successResponse(res, { funnel });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { getRequisitions, createRequisition, updateRequisition, getCandidates, createCandidate, updateCandidateStage, getRecruitmentFunnel };
