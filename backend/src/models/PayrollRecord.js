const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PayrollRecord = sequelize.define('PayrollRecord', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  payroll_run_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  period_month: { type: DataTypes.TINYINT, allowNull: false },
  period_year: { type: DataTypes.SMALLINT, allowNull: false },
  working_days: { type: DataTypes.TINYINT },
  present_days: { type: DataTypes.DECIMAL(5, 1) },
  lop_days: { type: DataTypes.DECIMAL(5, 1), defaultValue: 0 },
  basic: { type: DataTypes.DECIMAL(12, 2) },
  hra: { type: DataTypes.DECIMAL(12, 2) },
  other_allowances: { type: DataTypes.DECIMAL(12, 2) },
  gross_salary: { type: DataTypes.DECIMAL(12, 2) },
  pf_employee: { type: DataTypes.DECIMAL(12, 2) },
  pf_employer: { type: DataTypes.DECIMAL(12, 2) },
  esi_employee: { type: DataTypes.DECIMAL(12, 2) },
  esi_employer: { type: DataTypes.DECIMAL(12, 2) },
  professional_tax: { type: DataTypes.DECIMAL(8, 2) },
  income_tax: { type: DataTypes.DECIMAL(12, 2) },
  other_deductions: { type: DataTypes.DECIMAL(12, 2) },
  total_deductions: { type: DataTypes.DECIMAL(12, 2) },
  net_salary: { type: DataTypes.DECIMAL(12, 2) },
  status: {
    type: DataTypes.ENUM('Computed', 'Approved', 'Paid'),
    defaultValue: 'Computed',
  },
  payment_date: { type: DataTypes.DATEONLY },
  payment_mode: { type: DataTypes.STRING(50) },
  payslip_url: { type: DataTypes.STRING(500) },
}, {
  tableName: 'payroll_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { unique: true, fields: ['payroll_run_id', 'employee_id'] },
  ],
});

module.exports = PayrollRecord;
