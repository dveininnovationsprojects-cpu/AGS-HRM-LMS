const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Designation = sequelize.define('Designation', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  dept_id: { type: DataTypes.INTEGER.UNSIGNED },
  name: { type: DataTypes.STRING(200), allowNull: false },
  code: { type: DataTypes.STRING(50) },
  level: { type: DataTypes.TINYINT, defaultValue: 1 },
  is_active: { type: DataTypes.TINYINT(1), defaultValue: 1 },
}, {
  tableName: 'designations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Designation;
