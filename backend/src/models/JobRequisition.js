const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobRequisition = sequelize.define('JobRequisition', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  dept_id: { type: DataTypes.INTEGER.UNSIGNED },
  designation_id: { type: DataTypes.INTEGER.UNSIGNED },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  requirements: { type: DataTypes.TEXT },
  employment_type: {
    type: DataTypes.ENUM('Full-Time', 'Part-Time', 'Contract', 'Intern'),
    defaultValue: 'Full-Time',
  },
  positions: { type: DataTypes.TINYINT, defaultValue: 1 },
  min_experience: { type: DataTypes.DECIMAL(4, 1) },
  max_experience: { type: DataTypes.DECIMAL(4, 1) },
  min_salary: { type: DataTypes.DECIMAL(12, 2) },
  max_salary: { type: DataTypes.DECIMAL(12, 2) },
  location: { type: DataTypes.STRING(200) },
  status: {
    type: DataTypes.ENUM('Draft', 'Open', 'On-Hold', 'Closed', 'Cancelled'),
    defaultValue: 'Open',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium',
  },
  opened_by: { type: DataTypes.INTEGER.UNSIGNED },
  approved_by: { type: DataTypes.INTEGER.UNSIGNED },
  target_date: { type: DataTypes.DATEONLY },
}, {
  tableName: 'job_requisitions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = JobRequisition;
