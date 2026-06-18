const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  objectives: { type: DataTypes.TEXT },
  thumbnail_url: { type: DataTypes.STRING(500) },
  category: { type: DataTypes.STRING(100) },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner',
  },
  duration_mins: { type: DataTypes.INTEGER },
  is_mandatory: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  passing_score: { type: DataTypes.TINYINT, defaultValue: 70 },
  validity_days: { type: DataTypes.INTEGER },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    defaultValue: 'Draft',
  },
  created_by: { type: DataTypes.INTEGER.UNSIGNED },
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['org_id', 'slug'] },
  ],
});

module.exports = Course;
