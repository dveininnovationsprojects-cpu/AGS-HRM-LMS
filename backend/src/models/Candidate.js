const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  requisition_id: { type: DataTypes.INTEGER.UNSIGNED },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100) },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(30) },
  resume_url: { type: DataTypes.STRING(500) },
  linkedin_url: { type: DataTypes.STRING(300) },
  experience_years: { type: DataTypes.DECIMAL(4, 1) },
  current_company: { type: DataTypes.STRING(200) },
  current_ctc: { type: DataTypes.DECIMAL(12, 2) },
  expected_ctc: { type: DataTypes.DECIMAL(12, 2) },
  notice_period: { type: DataTypes.TINYINT },
  source: { type: DataTypes.STRING(100) },
  stage: {
    type: DataTypes.ENUM('Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'),
    defaultValue: 'Applied',
  },
  rating: { type: DataTypes.DECIMAL(3, 1) },
  notes: { type: DataTypes.TEXT },
  rejected_reason: { type: DataTypes.TEXT },
}, {
  tableName: 'candidates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ fields: ['stage'] }],
});

module.exports = Candidate;
