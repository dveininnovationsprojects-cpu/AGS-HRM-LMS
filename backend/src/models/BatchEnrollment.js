const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BatchEnrollment = sequelize.define('BatchEnrollment', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  batch_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  status: {
    type: DataTypes.ENUM('Enrolled', 'Attended', 'Absent', 'Dropped', 'Completed'),
    defaultValue: 'Enrolled',
  },
  attendance_pct: { type: DataTypes.DECIMAL(5, 2) },
  feedback: { type: DataTypes.TEXT },
  rating: { type: DataTypes.TINYINT },
  score: { type: DataTypes.TINYINT },
  activities_done: { type: DataTypes.TEXT },
  employee_cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  revenue_generated: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
}, {
  tableName: 'batch_enrollments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = BatchEnrollment;
