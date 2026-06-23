const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingProgram = sequelize.define('TrainingProgram', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING(100) },
  duration_days: { type: DataTypes.TINYINT },
  objectives: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, {
  tableName: 'training_programs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TrainingProgram;
