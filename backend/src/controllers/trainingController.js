const { TrainingBatch, Trainer, TrainingProgram, BatchEnrollment, Employee } = require('../models');
const { successResponse, errorResponse, getPagination, buildPaginationMeta } = require('../utils/helpers');

const getBatches = async (req, res) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const { rows, count } = await TrainingBatch.findAndCountAll({
      where,
      limit,
      offset,
      order: [['start_date', 'DESC']],
      include: [
        { model: Trainer, as: 'trainer', attributes: ['id', 'name', 'avatar_url', 'specialization', 'type'] },
        { model: TrainingProgram, as: 'program', attributes: ['id', 'title', 'description'] },
        {
          model: BatchEnrollment,
          as: 'enrollments',
          include: [{ model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] }]
        }
      ]
    });
    return successResponse(res, { batches: rows, pagination: buildPaginationMeta(count, page, limit) });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createBatch = async (req, res) => {
  try {
    const { batch_name, program_name, trainer_id, start_date, end_date, venue, mode, capacity, trainer_cost, material_cost, curriculum, trainee_ids } = req.body;
    
    let program = await TrainingProgram.findOne({ where: { title: program_name } });
    if (!program) {
      program = await TrainingProgram.create({ title: program_name, org_id: req.user?.org_id || 1 });
    }

    const batch = await TrainingBatch.create({
      program_id: program.id,
      trainer_id: trainer_id ? parseInt(trainer_id) : null,
      batch_name,
      start_date,
      end_date,
      venue,
      mode,
      capacity,
      status: 'Scheduled',
      trainer_cost: trainer_cost ? parseFloat(trainer_cost) : 0,
      material_cost: material_cost ? parseFloat(material_cost) : 0,
      curriculum: curriculum || []
    });

    if (Array.isArray(trainee_ids) && trainee_ids.length > 0) {
      const enrollments = trainee_ids.map(empId => ({
        batch_id: batch.id,
        employee_id: parseInt(empId),
        status: 'Enrolled',
        employee_cost: 400.0,
        revenue_generated: 0.0
      }));
      await BatchEnrollment.bulkCreate(enrollments);
    }

    return successResponse(res, { batch }, 'Training batch created', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateBatch = async (req, res) => {
  try {
    const batch = await TrainingBatch.findOne({ where: { id: req.params.id } });
    if (!batch) return errorResponse(res, 'Batch not found', 404);
    await batch.update(req.body);
    return successResponse(res, { batch }, 'Batch updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll({
      where: { is_active: true },
      include: [
        {
          model: TrainingBatch,
          as: 'batches',
          include: [{ model: BatchEnrollment, as: 'enrollments' }]
        }
      ]
    });
    return successResponse(res, { trainers });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create({
      ...req.body,
      org_id: req.user?.org_id || 1
    });
    return successResponse(res, { trainer }, 'Trainer registered', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const evaluateTrainee = async (req, res) => {
  try {
    const { id } = req.params; // batch_id
    const { employee_id, score, status, activities_done } = req.body;

    const enrollment = await BatchEnrollment.findOne({
      where: { batch_id: id, employee_id: parseInt(employee_id) }
    });

    if (!enrollment) return errorResponse(res, 'Enrollment record not found', 404);

    let employee_cost = enrollment.employee_cost;
    let revenue_generated = enrollment.revenue_generated;

    if (status === 'Completed') {
      const parsedScore = parseInt(score) || 80;
      revenue_generated = parsedScore >= 90 ? 8500.0 : parsedScore >= 75 ? 6000.0 : 4000.0;
      employee_cost = 1200.0;
      
      await Employee.update(
        { training_score: parsedScore, training_performance: parsedScore >= 90 ? 'Excellent' : parsedScore >= 75 ? 'Medium' : 'Poor' },
        { where: { id: parseInt(employee_id) } }
      );
    } else if (status === 'Dropped') {
      revenue_generated = 0.0;
      employee_cost = 400.0;
    }

    await enrollment.update({
      score: score ? parseInt(score) : null,
      status,
      activities_done,
      employee_cost,
      revenue_generated
    });

    const batch = await TrainingBatch.findOne({
      where: { id },
      include: [
        { model: Trainer, as: 'trainer', attributes: ['id', 'name', 'avatar_url', 'specialization', 'type'] },
        { model: TrainingProgram, as: 'program', attributes: ['id', 'title', 'description'] },
        {
          model: BatchEnrollment,
          as: 'enrollments',
          include: [{ model: Employee, as: 'employee', attributes: ['id', 'first_name', 'last_name', 'emp_code'] }]
        }
      ]
    });

    return successResponse(res, { batch }, 'Trainee evaluation updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getTrainingStats = async (req, res) => {
  try {
    const batches = await TrainingBatch.findAll({
      include: [{ model: BatchEnrollment, as: 'enrollments' }]
    });

    const trainers = await Trainer.findAll({
      where: { is_active: true }
    });

    let totalBatches = batches.length;
    let totalTrainees = 0;
    let totalTrainerCost = 0;
    let totalMaterialCost = 0;
    let totalEmployeeCost = 0;
    let totalRevenueBoost = 0;
    let completedTraineesCount = 0;
    let totalTraineeScore = 0;

    batches.forEach(b => {
      totalTrainerCost += parseFloat(b.trainer_cost || 0);
      totalMaterialCost += parseFloat(b.material_cost || 0);

      b.enrollments?.forEach(e => {
        totalTrainees += 1;
        totalEmployeeCost += parseFloat(e.employee_cost || 0);
        totalRevenueBoost += parseFloat(e.revenue_generated || 0);
        if (e.score !== null && e.score !== undefined) {
          totalTraineeScore += e.score;
          completedTraineesCount += 1;
        }
      });
    });

    const totalCost = totalTrainerCost + totalMaterialCost + totalEmployeeCost;
    const netProfit = totalRevenueBoost - totalCost;
    const roi = totalCost > 0 ? parseFloat(((netProfit / totalCost) * 100).toFixed(1)) : 0;
    const avgScore = completedTraineesCount > 0 ? Math.round(totalTraineeScore / completedTraineesCount) : 80;

    const trainerPerformance = await Promise.all(
      trainers.map(async t => {
        const tBatches = await TrainingBatch.findAll({
          where: { trainer_id: t.id },
          include: [{ model: BatchEnrollment, as: 'enrollments' }]
        });

        let trainerRevenue = 0;
        let trainerBatchCost = 0;
        let trTraineesCount = 0;
        let trTotalScore = 0;

        tBatches.forEach(b => {
          trainerBatchCost += parseFloat(b.trainer_cost || 0) + parseFloat(b.material_cost || 0);
          b.enrollments?.forEach(e => {
            trainerRevenue += parseFloat(e.revenue_generated || 0);
            trainerBatchCost += parseFloat(e.employee_cost || 0);
            if (e.score !== null && e.score !== undefined) {
              trTotalScore += e.score;
              trTraineesCount += 1;
            }
          });
        });

        const tProfit = trainerRevenue - trainerBatchCost;
        const tRoi = trainerBatchCost > 0 ? parseFloat(((tProfit / trainerBatchCost) * 100).toFixed(1)) : 0;
        const tAvgScore = trTraineesCount > 0 ? Math.round(trTotalScore / trTraineesCount) : 0;

        return {
          trainer_name: t.name,
          cost: trainerBatchCost,
          revenue: trainerRevenue,
          profit: tProfit,
          roi: tRoi,
          avg_score: tAvgScore,
          rating: t.rating || 5.0
        };
      })
    );

    const outcomes = [
      { name: 'Ops Guidelines', before: 54, after: 88 },
      { name: 'Security Compliance', before: 62, after: 94 },
      { name: 'Client Soft Skills', before: 48, after: 78 },
      { name: 'Leadership Core', before: 65, after: 90 },
    ];

    return successResponse(res, {
      stats: {
        totalBatches,
        totalTrainees,
        avgScore,
        totalTrainerCost,
        totalMaterialCost,
        totalEmployeeCost,
        totalCost,
        totalRevenueBoost,
        netProfit,
        roi
      },
      trainerPerformance,
      outcomes
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const getTrainingCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { sequelize } = require('../config/database');
    const batches = await sequelize.query(`
      SELECT b.id, b.batch_name as title, b.start_date, b.end_date, t.name as trainer_name, b.venue, b.capacity as max_participants, b.status
      FROM training_batches b
      LEFT JOIN trainers t ON b.trainer_id = t.id
      WHERE MONTH(b.start_date) = :month AND YEAR(b.start_date) = :year
      ORDER BY b.start_date ASC
    `, { replacements: { month, year }, type: sequelize.QueryTypes.SELECT });
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
      WHERE e.is_active = 1
      GROUP BY e.id
      ORDER BY courses_completed DESC
    `, { replacements: {}, type: sequelize.QueryTypes.SELECT });
    return successResponse(res, { skillMatrix: matrix });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  getBatches,
  createBatch,
  updateBatch,
  getTrainers,
  createTrainer,
  evaluateTrainee,
  getTrainingStats,
  getTrainingCalendar,
  getSkillMatrix
};
