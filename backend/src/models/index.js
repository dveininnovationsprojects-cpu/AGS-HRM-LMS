const { sequelize } = require('../config/database');
const User = require('./User');
const Employee = require('./Employee');
const Department = require('./Department');
const Designation = require('./Designation');
const AttendanceRecord = require('./AttendanceRecord');
const LeaveRequest = require('./LeaveRequest');
const PayrollRecord = require('./PayrollRecord');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const TrainingBatch = require('./TrainingBatch');
const PerformanceReview = require('./PerformanceReview');
const JobRequisition = require('./JobRequisition');
const Candidate = require('./Candidate');

// ── Associations ─────────────────────────────────────────────

// User ↔ Employee
User.hasOne(Employee, { foreignKey: 'user_id', as: 'employee' });
Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Department ↔ Employee
Department.hasMany(Employee, { foreignKey: 'dept_id', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'dept_id', as: 'department' });

// Designation ↔ Employee
Designation.hasMany(Employee, { foreignKey: 'designation_id', as: 'employees' });
Employee.belongsTo(Designation, { foreignKey: 'designation_id', as: 'designation' });

// Department ↔ Designation
Department.hasMany(Designation, { foreignKey: 'dept_id', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'dept_id', as: 'department' });

// Employee self-reference (manager)
Employee.belongsTo(Employee, { foreignKey: 'reporting_manager_id', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'reporting_manager_id', as: 'directReports' });

// Attendance ↔ Employee
Employee.hasMany(AttendanceRecord, { foreignKey: 'employee_id', as: 'attendanceRecords' });
AttendanceRecord.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Leave ↔ Employee
Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id', as: 'leaveRequests' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Payroll ↔ Employee
Employee.hasMany(PayrollRecord, { foreignKey: 'employee_id', as: 'payrollRecords' });
PayrollRecord.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Course ↔ Enrollment
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Employee ↔ Enrollment
Employee.hasMany(Enrollment, { foreignKey: 'employee_id', as: 'enrollments' });
Enrollment.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// JobRequisition ↔ Candidate
JobRequisition.hasMany(Candidate, { foreignKey: 'requisition_id', as: 'candidates' });
Candidate.belongsTo(JobRequisition, { foreignKey: 'requisition_id', as: 'requisition' });

// Employee ↔ PerformanceReview
Employee.hasMany(PerformanceReview, { foreignKey: 'employee_id', as: 'reviews' });
PerformanceReview.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Training Associations
const Trainer = require('./Trainer');
const TrainingProgram = require('./TrainingProgram');
const BatchEnrollment = require('./BatchEnrollment');

TrainingBatch.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
Trainer.hasMany(TrainingBatch, { foreignKey: 'trainer_id', as: 'batches' });

TrainingBatch.belongsTo(TrainingProgram, { foreignKey: 'program_id', as: 'program' });
TrainingProgram.hasMany(TrainingBatch, { foreignKey: 'program_id', as: 'batches' });

TrainingBatch.hasMany(BatchEnrollment, { foreignKey: 'batch_id', as: 'enrollments' });
BatchEnrollment.belongsTo(TrainingBatch, { foreignKey: 'batch_id', as: 'batch' });

Employee.hasMany(BatchEnrollment, { foreignKey: 'employee_id', as: 'batchEnrollments' });
BatchEnrollment.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = {
  sequelize,
  User,
  Employee,
  Department,
  Designation,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  Course,
  Enrollment,
  TrainingBatch,
  PerformanceReview,
  JobRequisition,
  Candidate,
  Trainer,
  TrainingProgram,
  BatchEnrollment,
};
