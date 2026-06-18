const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_id: { type: DataTypes.INTEGER.UNSIGNED },
  emp_code: { type: DataTypes.STRING(50), allowNull: false },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100) },
  middle_name: { type: DataTypes.STRING(100) },
  date_of_birth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
  blood_group: { type: DataTypes.STRING(10) },
  personal_email: { type: DataTypes.STRING(255) },
  work_email: { type: DataTypes.STRING(255), allowNull: false },
  phone_primary: { type: DataTypes.STRING(30) },
  phone_secondary: { type: DataTypes.STRING(30) },
  address_line1: { type: DataTypes.TEXT },
  address_line2: { type: DataTypes.TEXT },
  city: { type: DataTypes.STRING(100) },
  state: { type: DataTypes.STRING(100) },
  pincode: { type: DataTypes.STRING(20) },
  nationality: { type: DataTypes.STRING(100), defaultValue: 'Indian' },
  aadhaar_number: { type: DataTypes.STRING(20) },
  pan_number: { type: DataTypes.STRING(20) },
  passport_number: { type: DataTypes.STRING(30) },
  emergency_contact_name: { type: DataTypes.STRING(200) },
  emergency_contact_phone: { type: DataTypes.STRING(30) },
  emergency_contact_relation: { type: DataTypes.STRING(50) },
  dept_id: { type: DataTypes.INTEGER.UNSIGNED },
  designation_id: { type: DataTypes.INTEGER.UNSIGNED },
  reporting_manager_id: { type: DataTypes.INTEGER.UNSIGNED },
  employment_type: {
    type: DataTypes.ENUM('Full-Time', 'Part-Time', 'Contract', 'Consultant', 'Intern'),
    defaultValue: 'Full-Time',
  },
  employment_status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Resigned', 'Terminated', 'Retired', 'On-Leave'),
    defaultValue: 'Active',
  },
  date_of_joining: { type: DataTypes.DATEONLY },
  date_of_confirmation: { type: DataTypes.DATEONLY },
  date_of_exit: { type: DataTypes.DATEONLY },
  exit_reason: { type: DataTypes.TEXT },
  work_location: { type: DataTypes.STRING(200) },
  avatar_url: { type: DataTypes.STRING(500) },
  bank_name: { type: DataTypes.STRING(200) },
  bank_account_number: { type: DataTypes.STRING(50) },
  bank_ifsc: { type: DataTypes.STRING(20) },
  bank_branch: { type: DataTypes.STRING(200) },
  pf_number: { type: DataTypes.STRING(50) },
  esi_number: { type: DataTypes.STRING(50) },
  uan_number: { type: DataTypes.STRING(50) },
  created_by: { type: DataTypes.INTEGER.UNSIGNED },
  is_active: { type: DataTypes.TINYINT(1), defaultValue: 1 },
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['org_id', 'emp_code'] },
    { fields: ['dept_id'] },
    { fields: ['employment_status'] },
  ],
});

Employee.prototype.getFullName = function () {
  return [this.first_name, this.middle_name, this.last_name].filter(Boolean).join(' ');
};

module.exports = Employee;
