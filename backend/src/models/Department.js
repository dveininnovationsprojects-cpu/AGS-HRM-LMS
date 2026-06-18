const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  code: { type: DataTypes.STRING(50) },
  parent_id: { type: DataTypes.INTEGER.UNSIGNED },
  head_user_id: { type: DataTypes.INTEGER.UNSIGNED },
  description: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.TINYINT(1), defaultValue: 1 },
}, {
  tableName: 'departments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Department;
