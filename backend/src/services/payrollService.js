const { Employee, PayrollRecord } = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

const processMonthlyPayroll = async (month, year, employeeIds, orgId) => {
  const where = { org_id: orgId, employment_status: 'Active', is_active: 1 };
  if (employeeIds && employeeIds.length) where.id = employeeIds;

  const employees = await Employee.findAll({ where });
  const results = { processed: 0, skipped: 0, errors: [] };

  // Ensure payroll_runs table exists and get/create run
  let runId = 1;
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS payroll_runs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        org_id INT UNSIGNED NOT NULL,
        period_month TINYINT NOT NULL,
        period_year SMALLINT NOT NULL,
        status ENUM('Processing','Completed','Cancelled') DEFAULT 'Processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_run (org_id, period_month, period_year)
      ) ENGINE=InnoDB;
    `);
    await sequelize.query(
      `INSERT IGNORE INTO payroll_runs (org_id, period_month, period_year) VALUES (:orgId, :month, :year)`,
      { replacements: { orgId, month, year } }
    );
    const [run] = await sequelize.query(
      `SELECT id FROM payroll_runs WHERE org_id = :orgId AND period_month = :month AND period_year = :year LIMIT 1`,
      { replacements: { orgId, month, year }, type: sequelize.QueryTypes.SELECT }
    );
    if (run) runId = run.id;
  } catch (e) { logger.warn('payroll_runs setup:', e.message); }

  for (const emp of employees) {
    try {
      const existing = await PayrollRecord.findOne({
        where: { employee_id: emp.id, period_month: month, period_year: year },
      });
      if (existing) { results.skipped++; continue; }

      const [salary] = await sequelize.query(
        `SELECT * FROM salary_structures WHERE employee_id = :empId AND is_active = 1 LIMIT 1`,
        { replacements: { empId: emp.id }, type: sequelize.QueryTypes.SELECT }
      );

      const basicSalary = Number(salary?.basic_salary || 30000);
      const hra = Number(salary?.hra || basicSalary * 0.4);
      const transport = Number(salary?.transport_allowance || 1600);
      const medical = Number(salary?.medical_allowance || 1250);
      const otherAllowances = transport + medical + Number(salary?.special_allowance || 0);
      const grossSalary = basicSalary + hra + otherAllowances;

      const [attRow] = await sequelize.query(
        `SELECT COUNT(*) as present_days FROM attendance_records
         WHERE employee_id = :empId AND MONTH(date) = :month AND YEAR(date) = :year AND status = 'Present'`,
        { replacements: { empId: emp.id, month, year }, type: sequelize.QueryTypes.SELECT }
      );

      const presentDays = Number(attRow?.present_days || 26);
      const workingDays = 26;
      const lopDays = Math.max(0, workingDays - presentDays);
      const lopDeduction = (grossSalary / workingDays) * lopDays;

      const pfEmployee = basicSalary * 0.12;
      const pfEmployer = basicSalary * 0.12;
      const esiEmployee = grossSalary <= 21000 ? grossSalary * 0.0075 : 0;
      const esiEmployer = grossSalary <= 21000 ? grossSalary * 0.0325 : 0;
      const professionalTax = grossSalary > 15000 ? 200 : 0;
      const totalDeductions = pfEmployee + esiEmployee + professionalTax + lopDeduction;
      const netSalary = grossSalary - totalDeductions;

      await PayrollRecord.create({
        payroll_run_id: runId,
        employee_id: emp.id,
        period_month: month,
        period_year: year,
        basic: basicSalary,
        hra,
        other_allowances: otherAllowances,
        gross_salary: grossSalary,
        pf_employee: pfEmployee,
        pf_employer: pfEmployer,
        esi_employee: esiEmployee,
        esi_employer: esiEmployer,
        professional_tax: professionalTax,
        income_tax: 0,
        other_deductions: lopDeduction,
        total_deductions: totalDeductions,
        net_salary: netSalary,
        present_days: presentDays,
        working_days: workingDays,
        lop_days: lopDays,
        status: 'Computed',
      });

      results.processed++;
    } catch (err) {
      logger.error(`Payroll error emp ${emp.id}:`, err.message);
      results.errors.push({ employee_id: emp.id, error: err.message });
    }
  }

  try {
    await sequelize.query(
      `UPDATE payroll_runs SET status='Completed' WHERE id = :id`,
      { replacements: { id: runId } }
    );
  } catch {}

  return results;
};

module.exports = { processMonthlyPayroll };
