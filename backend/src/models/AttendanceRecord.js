const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  check_in: { type: DataTypes.DATE },
  check_out: { type: DataTypes.DATE },
  check_in_lat: { type: DataTypes.DECIMAL(10, 8) },
  check_in_lng: { type: DataTypes.DECIMAL(11, 8) },
  check_out_lat: { type: DataTypes.DECIMAL(10, 8) },
  check_out_lng: { type: DataTypes.DECIMAL(11, 8) },
  total_hours: { type: DataTypes.DECIMAL(5, 2) },
  overtime_hours: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Half-Day', 'Work-From-Home', 'On-Leave', 'Holiday', 'Weekend'),
    defaultValue: 'Present',
  },
  is_regularized: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  remarks: { type: DataTypes.STRING(500) },
}, {
  tableName: 'attendance_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['employee_id', 'date'] },
    { fields: ['date'] },
  ],
});

module.exports = AttendanceRecord;
