const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PerformanceReview = sequelize.define('PerformanceReview', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  cycle_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  reviewer_id: { type: DataTypes.INTEGER.UNSIGNED },
  type: {
    type: DataTypes.ENUM('Self', 'Manager', 'Peer', '360'),
    defaultValue: 'Manager',
  },
  overall_score: { type: DataTypes.DECIMAL(5, 2) },
  status: {
    type: DataTypes.ENUM('Pending', 'In-Progress', 'Submitted', 'Acknowledged'),
    defaultValue: 'Pending',
  },
  strengths: { type: DataTypes.TEXT },
  improvements: { type: DataTypes.TEXT },
  comments: { type: DataTypes.TEXT },
  submitted_at: { type: DataTypes.DATE },
  acknowledged_at: { type: DataTypes.DATE },
}, {
  tableName: 'performance_reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PerformanceReview;
