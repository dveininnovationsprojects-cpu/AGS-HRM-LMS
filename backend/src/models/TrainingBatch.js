const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingBatch = sequelize.define('TrainingBatch', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  program_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  trainer_id: { type: DataTypes.INTEGER.UNSIGNED },
  batch_name: { type: DataTypes.STRING(200), allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY },
  venue: { type: DataTypes.STRING(300) },
  mode: {
    type: DataTypes.ENUM('In-Person', 'Online', 'Hybrid'),
    defaultValue: 'In-Person',
  },
  meeting_link: { type: DataTypes.STRING(500) },
  capacity: { type: DataTypes.TINYINT, defaultValue: 30 },
  status: {
    type: DataTypes.ENUM('Scheduled', 'In-Progress', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled',
  },
}, {
  tableName: 'training_batches',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TrainingBatch;
