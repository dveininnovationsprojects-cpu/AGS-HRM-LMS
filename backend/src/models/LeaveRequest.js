const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  leave_type_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  from_date: { type: DataTypes.DATEONLY, allowNull: false },
  to_date: { type: DataTypes.DATEONLY, allowNull: false },
  days: { type: DataTypes.DECIMAL(5, 1), allowNull: false },
  is_half_day: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  half_day_slot: { type: DataTypes.ENUM('First', 'Second') },
  reason: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Withdrawn'),
    defaultValue: 'Pending',
  },
  approved_by: { type: DataTypes.INTEGER.UNSIGNED },
  approved_at: { type: DataTypes.DATE },
  reject_reason: { type: DataTypes.TEXT },
}, {
  tableName: 'leave_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ fields: ['status'] }],
});

module.exports = LeaveRequest;
