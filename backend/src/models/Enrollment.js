const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  course_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  enrolled_by: { type: DataTypes.INTEGER.UNSIGNED },
  status: {
    type: DataTypes.ENUM('Enrolled', 'In-Progress', 'Completed', 'Dropped', 'Expired'),
    defaultValue: 'Enrolled',
  },
  enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  started_at: { type: DataTypes.DATE },
  completed_at: { type: DataTypes.DATE },
  expiry_date: { type: DataTypes.DATEONLY },
  score: { type: DataTypes.DECIMAL(5, 2) },
  is_certified: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  certificate_url: { type: DataTypes.STRING(500) },
}, {
  tableName: 'enrollments',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['employee_id', 'course_id'] },
  ],
});

module.exports = Enrollment;
