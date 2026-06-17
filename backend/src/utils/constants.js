module.exports = {
  // Employment
  EMPLOYMENT_TYPES: ['Full-Time', 'Part-Time', 'Contract', 'Consultant', 'Intern'],
  EMPLOYMENT_STATUS: ['Active', 'Inactive', 'Resigned', 'Terminated', 'Retired', 'On-Leave'],

  // Attendance
  ATTENDANCE_STATUS: ['Present', 'Absent', 'Half-Day', 'Work-From-Home', 'On-Leave', 'Holiday', 'Weekend'],

  // Leave
  LEAVE_STATUS: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Withdrawn'],

  // Payroll
  PAYROLL_STATUS: ['Draft', 'Processing', 'Completed', 'Approved', 'Paid'],

  // Recruitment
  CANDIDATE_STAGES: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'],

  // LMS
  COURSE_LEVELS: ['Beginner', 'Intermediate', 'Advanced'],
  ENROLLMENT_STATUS: ['Enrolled', 'In-Progress', 'Completed', 'Dropped', 'Expired'],

  // Performance
  REVIEW_TYPES: ['Self', 'Manager', 'Peer', '360'],
  REVIEW_STATUS: ['Pending', 'In-Progress', 'Submitted', 'Acknowledged'],

  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Token expiry (ms)
  ACCESS_TOKEN_TTL: '15m',
  REFRESH_TOKEN_TTL: '7d',

  // Cache TTL (seconds)
  CACHE_TTL_SHORT: 60,
  CACHE_TTL_MEDIUM: 300,
  CACHE_TTL_LONG: 3600,

  // Roles
  ROLES: {
    SUPER_ADMIN: 'super-admin',
    HR_MANAGER: 'hr-manager',
    HR_EXECUTIVE: 'hr-executive',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    FINANCE: 'finance',
    LD_MANAGER: 'ld-manager',
  },

  // Modules
  MODULES: {
    EMPLOYEES: 'employees',
    ATTENDANCE: 'attendance',
    PAYROLL: 'payroll',
    LMS: 'lms',
    RECRUITMENT: 'recruitment',
    TRAINING: 'training',
    PERFORMANCE: 'performance',
    ANALYTICS: 'analytics',
    AI: 'ai',
    REPORTS: 'reports',
  },

  // File upload
  UPLOAD_TYPES: {
    AVATAR: 'avatar',
    DOCUMENT: 'document',
    RESUME: 'resume',
    CERTIFICATE: 'certificate',
  },

  // Payroll components
  COMPONENT_TYPES: {
    EARNING: 'Earning',
    DEDUCTION: 'Deduction',
    TAX: 'Tax',
  },

  // India specific
  PF_EMPLOYEE_RATE: 0.12,
  PF_EMPLOYER_RATE: 0.12,
  PF_WAGE_CEILING: 15000,
  ESI_EMPLOYEE_RATE: 0.0075,
  ESI_EMPLOYER_RATE: 0.0325,
  ESI_WAGE_CEILING: 21000,

  // Professional tax slabs (Karnataka)
  PT_SLABS: [
    { min: 0, max: 15000, tax: 0 },
    { min: 15001, max: 999999999, tax: 200 },
  ],
};
