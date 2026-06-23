const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trainer = sequelize.define('Trainer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  user_id: { type: DataTypes.INTEGER.UNSIGNED },
  name: { type: DataTypes.STRING(200), allowNull: false },
  email: { type: DataTypes.STRING(255) },
  phone: { type: DataTypes.STRING(30) },
  specialization: { type: DataTypes.STRING(255) },
  bio: { type: DataTypes.TEXT },
  type: {
    type: DataTypes.ENUM('Internal', 'External'),
    defaultValue: 'Internal',
  },
  cost_per_batch: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  avatar_url: { type: DataTypes.STRING(500) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, {
  tableName: 'trainers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Trainer;
