-- ============================================================
-- AGS Health Workforce Intelligence Platform
-- Complete MySQL Database Schema
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS ags_hrm_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ags_hrm_lms;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  code       VARCHAR(50)  NOT NULL UNIQUE,
  logo_url   VARCHAR(500),
  industry   VARCHAR(100) DEFAULT 'Healthcare',
  address    TEXT,
  city       VARCHAR(100),
  state      VARCHAR(100),
  country    VARCHAR(100) DEFAULT 'India',
  pincode    VARCHAR(20),
  phone      VARCHAR(30),
  email      VARCHAR(255),
  website    VARCHAR(255),
  gstin      VARCHAR(30),
  pan        VARCHAR(20),
  timezone   VARCHAR(50) DEFAULT 'Asia/Kolkata',
  currency   VARCHAR(10) DEFAULT 'INR',
  fiscal_start_month TINYINT DEFAULT 4,
  is_active  TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- ROLES & PERMISSIONS (RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  description TEXT,
  is_system   TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_role_org (org_id, slug),
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permissions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module      VARCHAR(100) NOT NULL,
  action      VARCHAR(100) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id       INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  UNIQUE KEY uq_rp (role_id, permission_id),
  FOREIGN KEY (role_id)       REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id             INT UNSIGNED NOT NULL,
  email              VARCHAR(255) NOT NULL,
  password_hash      VARCHAR(255) NOT NULL,
  first_name         VARCHAR(100) NOT NULL,
  last_name          VARCHAR(100),
  phone              VARCHAR(30),
  avatar_url         VARCHAR(500),
  is_active          TINYINT(1) DEFAULT 1,
  is_email_verified  TINYINT(1) DEFAULT 0,
  mfa_enabled        TINYINT(1) DEFAULT 0,
  mfa_secret         VARCHAR(100),
  refresh_token_hash VARCHAR(255),
  last_login         TIMESTAMP NULL,
  password_reset_token VARCHAR(100),
  password_reset_expires TIMESTAMP NULL,
  failed_login_attempts TINYINT DEFAULT 0,
  locked_until       TIMESTAMP NULL,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_email (org_id, email),
  INDEX idx_email (email),
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_roles (
  id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  UNIQUE KEY uq_ur (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- DEPARTMENTS & DESIGNATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  name        VARCHAR(200) NOT NULL,
  code        VARCHAR(50),
  parent_id   INT UNSIGNED,
  head_user_id INT UNSIGNED,
  description TEXT,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)       REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id)    REFERENCES departments(id)   ON DELETE SET NULL,
  FOREIGN KEY (head_user_id) REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS designations (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  dept_id     INT UNSIGNED,
  name        VARCHAR(200) NOT NULL,
  code        VARCHAR(50),
  level       TINYINT DEFAULT 1 COMMENT '1=Junior,2=Mid,3=Senior,4=Lead,5=Manager,6=Director',
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)  REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (dept_id) REFERENCES departments(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- EMPLOYEES
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id             INT UNSIGNED NOT NULL,
  user_id            INT UNSIGNED,
  emp_code           VARCHAR(50) NOT NULL,
  first_name         VARCHAR(100) NOT NULL,
  last_name          VARCHAR(100),
  middle_name        VARCHAR(100),
  date_of_birth      DATE,
  gender             ENUM('Male','Female','Other'),
  blood_group        VARCHAR(10),
  personal_email     VARCHAR(255),
  work_email         VARCHAR(255) NOT NULL,
  phone_primary      VARCHAR(30),
  phone_secondary    VARCHAR(30),
  address_line1      TEXT,
  address_line2      TEXT,
  city               VARCHAR(100),
  state              VARCHAR(100),
  pincode            VARCHAR(20),
  nationality        VARCHAR(100) DEFAULT 'Indian',
  aadhaar_number     VARCHAR(20),
  pan_number         VARCHAR(20),
  passport_number    VARCHAR(30),
  emergency_contact_name  VARCHAR(200),
  emergency_contact_phone VARCHAR(30),
  emergency_contact_relation VARCHAR(50),
  dept_id            INT UNSIGNED,
  designation_id     INT UNSIGNED,
  reporting_manager_id INT UNSIGNED,
  employment_type    ENUM('Full-Time','Part-Time','Contract','Consultant','Intern') DEFAULT 'Full-Time',
  employment_status  ENUM('Active','Inactive','Resigned','Terminated','Retired','On-Leave') DEFAULT 'Active',
  date_of_joining    DATE,
  date_of_confirmation DATE,
  date_of_exit       DATE,
  exit_reason        TEXT,
  work_location      VARCHAR(200),
  work_country       VARCHAR(100) DEFAULT 'India',
  work_branch        VARCHAR(150) DEFAULT 'Chennai',
  avatar_url         VARCHAR(500),
  bank_name          VARCHAR(200),
  bank_account_number VARCHAR(50),
  bank_ifsc          VARCHAR(20),
  bank_branch        VARCHAR(200),
  pf_number          VARCHAR(50),
  esi_number         VARCHAR(50),
  uan_number         VARCHAR(50),
  created_by         INT UNSIGNED,
  is_active          TINYINT(1) DEFAULT 1,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_emp_code (org_id, emp_code),
  INDEX idx_dept    (dept_id),
  INDEX idx_status  (employment_status),
  FOREIGN KEY (org_id)           REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)          REFERENCES users(id)         ON DELETE SET NULL,
  FOREIGN KEY (dept_id)          REFERENCES departments(id)   ON DELETE SET NULL,
  FOREIGN KEY (designation_id)   REFERENCES designations(id)  ON DELETE SET NULL,
  FOREIGN KEY (reporting_manager_id) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS employee_documents (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id  INT UNSIGNED NOT NULL,
  doc_type     VARCHAR(100) NOT NULL,
  doc_name     VARCHAR(255) NOT NULL,
  file_url     VARCHAR(500) NOT NULL,
  file_size    INT,
  mime_type    VARCHAR(100),
  is_verified  TINYINT(1) DEFAULT 0,
  verified_by  INT UNSIGNED,
  verified_at  TIMESTAMP NULL,
  expiry_date  DATE,
  uploaded_by  INT UNSIGNED,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- RECRUITMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS job_requisitions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id          INT UNSIGNED NOT NULL,
  dept_id         INT UNSIGNED,
  designation_id  INT UNSIGNED,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  requirements    TEXT,
  employment_type ENUM('Full-Time','Part-Time','Contract','Intern') DEFAULT 'Full-Time',
  positions       TINYINT DEFAULT 1,
  min_experience  DECIMAL(4,1),
  max_experience  DECIMAL(4,1),
  min_salary      DECIMAL(12,2),
  max_salary      DECIMAL(12,2),
  location        VARCHAR(200),
  status          ENUM('Draft','Open','On-Hold','Closed','Cancelled') DEFAULT 'Open',
  priority        ENUM('Low','Medium','High','Urgent') DEFAULT 'Medium',
  opened_by       INT UNSIGNED,
  approved_by     INT UNSIGNED,
  target_date     DATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)         REFERENCES organizations(id)  ON DELETE CASCADE,
  FOREIGN KEY (dept_id)        REFERENCES departments(id)    ON DELETE SET NULL,
  FOREIGN KEY (designation_id) REFERENCES designations(id)   ON DELETE SET NULL,
  FOREIGN KEY (opened_by)      REFERENCES users(id)          ON DELETE SET NULL,
  FOREIGN KEY (approved_by)    REFERENCES users(id)          ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS candidates (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id          INT UNSIGNED NOT NULL,
  requisition_id  INT UNSIGNED,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100),
  email           VARCHAR(255) NOT NULL,
  phone           VARCHAR(30),
  resume_url      VARCHAR(500),
  linkedin_url    VARCHAR(300),
  experience_years DECIMAL(4,1),
  current_company VARCHAR(200),
  current_ctc     DECIMAL(12,2),
  expected_ctc    DECIMAL(12,2),
  notice_period   TINYINT COMMENT 'days',
  source          VARCHAR(100) COMMENT 'LinkedIn, Naukri, Referral, etc.',
  stage           ENUM('Applied','Screening','Interview','Offer','Hired','Rejected','Withdrawn') DEFAULT 'Applied',
  rating          DECIMAL(3,1),
  notes           TEXT,
  rejected_reason TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_stage (stage),
  FOREIGN KEY (org_id)          REFERENCES organizations(id)    ON DELETE CASCADE,
  FOREIGN KEY (requisition_id)  REFERENCES job_requisitions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS interviews (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id  INT UNSIGNED NOT NULL,
  interviewer_id INT UNSIGNED,
  round         TINYINT DEFAULT 1,
  type          ENUM('Phone','Video','In-Person','Technical','HR') DEFAULT 'Video',
  scheduled_at  DATETIME,
  duration_mins TINYINT DEFAULT 60,
  meeting_link  VARCHAR(500),
  status        ENUM('Scheduled','Completed','Cancelled','No-Show') DEFAULT 'Scheduled',
  result        ENUM('Selected','Rejected','On-Hold'),
  feedback      TEXT,
  rating        DECIMAL(3,1),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id)   REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (interviewer_id) REFERENCES users(id)      ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS offers (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id    INT UNSIGNED NOT NULL,
  requisition_id  INT UNSIGNED,
  ctc             DECIMAL(12,2),
  joining_date    DATE,
  offer_letter_url VARCHAR(500),
  status          ENUM('Draft','Sent','Accepted','Rejected','Withdrawn') DEFAULT 'Draft',
  expiry_date     DATE,
  sent_at         TIMESTAMP NULL,
  responded_at    TIMESTAMP NULL,
  created_by      INT UNSIGNED,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id)   REFERENCES candidates(id)       ON DELETE CASCADE,
  FOREIGN KEY (requisition_id) REFERENCES job_requisitions(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by)     REFERENCES users(id)            ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- ATTENDANCE & LEAVE
-- ============================================================
CREATE TABLE IF NOT EXISTS shifts (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  name        VARCHAR(100) NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  break_mins  TINYINT DEFAULT 60,
  is_night_shift TINYINT(1) DEFAULT 0,
  grace_mins  TINYINT DEFAULT 10,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS shift_assignments (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  shift_id    INT UNSIGNED NOT NULL,
  effective_from DATE NOT NULL,
  effective_to   DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (shift_id)    REFERENCES shifts(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS attendance_records (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id    INT UNSIGNED NOT NULL,
  date           DATE NOT NULL,
  check_in       DATETIME,
  check_out      DATETIME,
  check_in_lat   DECIMAL(10,8),
  check_in_lng   DECIMAL(11,8),
  check_out_lat  DECIMAL(10,8),
  check_out_lng  DECIMAL(11,8),
  total_hours    DECIMAL(5,2),
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  status         ENUM('Present','Absent','Half-Day','Work-From-Home','On-Leave','Holiday','Weekend') DEFAULT 'Present',
  is_regularized TINYINT(1) DEFAULT 0,
  remarks        VARCHAR(500),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_att_date (employee_id, date),
  INDEX idx_date (date),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leave_types (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id          INT UNSIGNED NOT NULL,
  name            VARCHAR(100) NOT NULL,
  code            VARCHAR(20)  NOT NULL,
  days_per_year   DECIMAL(5,1),
  is_paid         TINYINT(1) DEFAULT 1,
  carry_forward   TINYINT(1) DEFAULT 0,
  max_carry_forward DECIMAL(5,1) DEFAULT 0,
  min_notice_days  TINYINT DEFAULT 0,
  allow_half_day   TINYINT(1) DEFAULT 1,
  color           VARCHAR(10) DEFAULT '#04549B',
  is_active       TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leave_requests (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id    INT UNSIGNED NOT NULL,
  leave_type_id  INT UNSIGNED NOT NULL,
  from_date      DATE NOT NULL,
  to_date        DATE NOT NULL,
  days           DECIMAL(5,1) NOT NULL,
  is_half_day    TINYINT(1) DEFAULT 0,
  half_day_slot  ENUM('First','Second'),
  reason         TEXT NOT NULL,
  status         ENUM('Pending','Approved','Rejected','Cancelled','Withdrawn') DEFAULT 'Pending',
  approved_by    INT UNSIGNED,
  approved_at    TIMESTAMP NULL,
  reject_reason  TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  FOREIGN KEY (employee_id)   REFERENCES employees(id)   ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by)   REFERENCES users(id)       ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS holidays (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id     INT UNSIGNED NOT NULL,
  name       VARCHAR(200) NOT NULL,
  date       DATE NOT NULL,
  type       ENUM('National','Regional','Optional','Restricted') DEFAULT 'National',
  is_active  TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- PAYROLL
-- ============================================================
CREATE TABLE IF NOT EXISTS salary_components (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id       INT UNSIGNED NOT NULL,
  name         VARCHAR(100) NOT NULL,
  code         VARCHAR(30)  NOT NULL,
  type         ENUM('Earning','Deduction','Tax') NOT NULL,
  calc_type    ENUM('Fixed','Percentage','Formula') DEFAULT 'Fixed',
  calc_value   DECIMAL(10,4),
  calc_basis   VARCHAR(100) COMMENT 'E.g. BASIC for percentage components',
  is_taxable   TINYINT(1) DEFAULT 1,
  is_statutory TINYINT(1) DEFAULT 0,
  is_active    TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS salary_structures (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS salary_structure_components (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  structure_id   INT UNSIGNED NOT NULL,
  component_id   INT UNSIGNED NOT NULL,
  order_seq      TINYINT DEFAULT 1,
  FOREIGN KEY (structure_id) REFERENCES salary_structures(id)  ON DELETE CASCADE,
  FOREIGN KEY (component_id) REFERENCES salary_components(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS employee_salaries (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id     INT UNSIGNED NOT NULL,
  structure_id    INT UNSIGNED,
  ctc_annual      DECIMAL(14,2) NOT NULL,
  basic           DECIMAL(12,2),
  hra             DECIMAL(12,2),
  effective_from  DATE NOT NULL,
  effective_to    DATE,
  revised_by      INT UNSIGNED,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id)  REFERENCES employees(id)          ON DELETE CASCADE,
  FOREIGN KEY (structure_id) REFERENCES salary_structures(id)  ON DELETE SET NULL,
  FOREIGN KEY (revised_by)   REFERENCES users(id)              ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payroll_runs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  period_month TINYINT NOT NULL,
  period_year  SMALLINT NOT NULL,
  status      ENUM('Draft','Processing','Completed','Approved','Paid') DEFAULT 'Draft',
  total_gross DECIMAL(16,2),
  total_net   DECIMAL(16,2),
  total_tax   DECIMAL(16,2),
  total_deductions DECIMAL(16,2),
  employee_count INT,
  run_by      INT UNSIGNED,
  approved_by INT UNSIGNED,
  run_at      TIMESTAMP NULL,
  approved_at TIMESTAMP NULL,
  paid_at     TIMESTAMP NULL,
  remarks     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_run (org_id, period_month, period_year),
  FOREIGN KEY (org_id)      REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (run_by)      REFERENCES users(id)         ON DELETE SET NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payroll_records (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  payroll_run_id  INT UNSIGNED NOT NULL,
  employee_id     INT UNSIGNED NOT NULL,
  period_month    TINYINT NOT NULL,
  period_year     SMALLINT NOT NULL,
  working_days    TINYINT,
  present_days    DECIMAL(5,1),
  lop_days        DECIMAL(5,1) DEFAULT 0,
  basic           DECIMAL(12,2),
  hra             DECIMAL(12,2),
  other_allowances DECIMAL(12,2),
  gross_salary    DECIMAL(12,2),
  pf_employee     DECIMAL(12,2),
  pf_employer     DECIMAL(12,2),
  esi_employee    DECIMAL(12,2),
  esi_employer    DECIMAL(12,2),
  professional_tax DECIMAL(8,2),
  income_tax      DECIMAL(12,2),
  other_deductions DECIMAL(12,2),
  total_deductions DECIMAL(12,2),
  net_salary      DECIMAL(12,2),
  status          ENUM('Computed','Approved','Paid') DEFAULT 'Computed',
  payment_date    DATE,
  payment_mode    VARCHAR(50),
  payslip_url     VARCHAR(500),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_rec (payroll_run_id, employee_id),
  FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id)  ON DELETE CASCADE,
  FOREIGN KEY (employee_id)    REFERENCES employees(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- LMS
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id         INT UNSIGNED NOT NULL,
  title          VARCHAR(255) NOT NULL,
  slug           VARCHAR(255) NOT NULL,
  description    TEXT,
  objectives     TEXT,
  thumbnail_url  VARCHAR(500),
  category       VARCHAR(100),
  level          ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  duration_mins  INT,
  is_mandatory   TINYINT(1) DEFAULT 0,
  passing_score  TINYINT DEFAULT 70,
  validity_days  INT COMMENT 'Certificate validity',
  status         ENUM('Draft','Published','Archived') DEFAULT 'Draft',
  created_by     INT UNSIGNED,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_slug (org_id, slug),
  FOREIGN KEY (org_id)    REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lessons (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id    INT UNSIGNED NOT NULL,
  title        VARCHAR(255) NOT NULL,
  type         ENUM('Video','Document','SCORM','Quiz','Article') DEFAULT 'Video',
  content_url  VARCHAR(500),
  content_text LONGTEXT,
  duration_mins INT,
  order_seq    TINYINT DEFAULT 1,
  is_free_preview TINYINT(1) DEFAULT 0,
  is_active    TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_paths (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  is_active   TINYINT(1) DEFAULT 1,
  created_by  INT UNSIGNED,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)    REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_path_courses (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  path_id        INT UNSIGNED NOT NULL,
  course_id      INT UNSIGNED NOT NULL,
  order_seq      TINYINT DEFAULT 1,
  FOREIGN KEY (path_id)   REFERENCES learning_paths(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id)        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS enrollments (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id    INT UNSIGNED NOT NULL,
  course_id      INT UNSIGNED NOT NULL,
  enrolled_by    INT UNSIGNED,
  status         ENUM('Enrolled','In-Progress','Completed','Dropped','Expired') DEFAULT 'Enrolled',
  enrolled_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at     TIMESTAMP NULL,
  completed_at   TIMESTAMP NULL,
  expiry_date    DATE,
  score          DECIMAL(5,2),
  is_certified   TINYINT(1) DEFAULT 0,
  certificate_url VARCHAR(500),
  UNIQUE KEY uq_enroll (employee_id, course_id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)   REFERENCES courses(id)   ON DELETE CASCADE,
  FOREIGN KEY (enrolled_by) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS course_progress (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enrollment_id INT UNSIGNED NOT NULL,
  lesson_id   INT UNSIGNED NOT NULL,
  status      ENUM('Not-Started','In-Progress','Completed') DEFAULT 'Not-Started',
  progress_pct DECIMAL(5,2) DEFAULT 0,
  time_spent_mins INT DEFAULT 0,
  started_at  TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  UNIQUE KEY uq_prog (enrollment_id, lesson_id),
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id)     REFERENCES lessons(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessments (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id    INT UNSIGNED,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  type         ENUM('Pre-Test','Post-Test','Mid-Test') DEFAULT 'Post-Test',
  passing_score TINYINT DEFAULT 70,
  time_limit_mins INT,
  max_attempts TINYINT DEFAULT 3,
  is_active    TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessment_questions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id   INT UNSIGNED NOT NULL,
  question        TEXT NOT NULL,
  type            ENUM('MCQ','True-False','Short-Answer') DEFAULT 'MCQ',
  options         JSON,
  correct_answer  TEXT,
  explanation     TEXT,
  marks           TINYINT DEFAULT 1,
  order_seq       TINYINT DEFAULT 1,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id  INT UNSIGNED NOT NULL,
  employee_id    INT UNSIGNED NOT NULL,
  enrollment_id  INT UNSIGNED,
  attempt_no     TINYINT DEFAULT 1,
  score          DECIMAL(5,2),
  is_passed      TINYINT(1) DEFAULT 0,
  answers        JSON,
  started_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at   TIMESTAMP NULL,
  time_taken_mins INT,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)  ON DELETE CASCADE,
  FOREIGN KEY (employee_id)   REFERENCES employees(id)    ON DELETE CASCADE,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS certificates (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id    INT UNSIGNED NOT NULL,
  course_id      INT UNSIGNED,
  enrollment_id  INT UNSIGNED,
  cert_number    VARCHAR(100) NOT NULL UNIQUE,
  issued_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date    DATE,
  certificate_url VARCHAR(500),
  is_revoked     TINYINT(1) DEFAULT 0,
  FOREIGN KEY (employee_id)  REFERENCES employees(id)    ON DELETE CASCADE,
  FOREIGN KEY (course_id)    REFERENCES courses(id)      ON DELETE SET NULL,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TRAINING
-- ============================================================
CREATE TABLE IF NOT EXISTS trainers (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED,
  name        VARCHAR(200) NOT NULL,
  email       VARCHAR(255),
  phone       VARCHAR(30),
  specialization VARCHAR(255),
  bio         TEXT,
  type        ENUM('Internal','External') DEFAULT 'Internal',
  cost_per_batch DECIMAL(10,2) DEFAULT 0.0,
  avatar_url  VARCHAR(500),
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)   REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS training_programs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  category    VARCHAR(100),
  duration_days TINYINT,
  objectives  TEXT,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS training_batches (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  program_id     INT UNSIGNED NOT NULL,
  trainer_id     INT UNSIGNED,
  batch_name     VARCHAR(200) NOT NULL,
  start_date     DATE NOT NULL,
  end_date       DATE,
  venue          VARCHAR(300),
  mode           ENUM('In-Person','Online','Hybrid') DEFAULT 'In-Person',
  meeting_link   VARCHAR(500),
  capacity       TINYINT DEFAULT 30,
  status         ENUM('Scheduled','In-Progress','Completed','Cancelled') DEFAULT 'Scheduled',
  trainer_cost   DECIMAL(10,2) DEFAULT 0.0,
  material_cost  DECIMAL(10,2) DEFAULT 0.0,
  curriculum     JSON,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id)          ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS batch_enrollments (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  batch_id    INT UNSIGNED NOT NULL,
  employee_id INT UNSIGNED NOT NULL,
  status      ENUM('Enrolled','Attended','Absent','Dropped','Completed') DEFAULT 'Enrolled',
  attendance_pct DECIMAL(5,2),
  feedback    TEXT,
  rating      TINYINT,
  score       TINYINT,
  activities_done TEXT,
  employee_cost DECIMAL(10,2) DEFAULT 0.0,
  revenue_generated DECIMAL(10,2) DEFAULT 0.0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_be (batch_id, employee_id),
  FOREIGN KEY (batch_id)    REFERENCES training_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PERFORMANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS performance_cycles (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id       INT UNSIGNED NOT NULL,
  title        VARCHAR(255) NOT NULL,
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  status       ENUM('Draft','Active','Completed') DEFAULT 'Draft',
  type         ENUM('Annual','Semi-Annual','Quarterly','Monthly') DEFAULT 'Annual',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kpis (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  dept_id     INT UNSIGNED,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  unit        VARCHAR(50),
  target_value DECIMAL(10,2),
  weight      DECIMAL(5,2) DEFAULT 100,
  category    VARCHAR(100),
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)  REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (dept_id) REFERENCES departments(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS goals (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL,
  cycle_id    INT UNSIGNED,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  due_date    DATE,
  status      ENUM('Not-Started','In-Progress','Completed','Cancelled') DEFAULT 'Not-Started',
  priority    ENUM('Low','Medium','High') DEFAULT 'Medium',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)           ON DELETE CASCADE,
  FOREIGN KEY (cycle_id)    REFERENCES performance_cycles(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS performance_reviews (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cycle_id       INT UNSIGNED NOT NULL,
  employee_id    INT UNSIGNED NOT NULL,
  reviewer_id    INT UNSIGNED,
  type           ENUM('Self','Manager','Peer','360') DEFAULT 'Manager',
  overall_score  DECIMAL(5,2),
  status         ENUM('Pending','In-Progress','Submitted','Acknowledged') DEFAULT 'Pending',
  strengths      TEXT,
  improvements   TEXT,
  comments       TEXT,
  submitted_at   TIMESTAMP NULL,
  acknowledged_at TIMESTAMP NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cycle_id)    REFERENCES performance_cycles(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)          ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id)              ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- AI, REPORTS, AUDIT, NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  category    VARCHAR(100) COMMENT 'Attrition, Attendance, Performance, etc.',
  title       VARCHAR(255),
  insight     TEXT NOT NULL,
  recommendation TEXT,
  severity    ENUM('Info','Warning','Critical') DEFAULT 'Info',
  is_read     TINYINT(1) DEFAULT 0,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS report_templates (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id       INT UNSIGNED NOT NULL,
  name         VARCHAR(255) NOT NULL,
  module       VARCHAR(100),
  description  TEXT,
  template_config JSON,
  format       ENUM('PDF','Excel','CSV') DEFAULT 'PDF',
  is_active    TINYINT(1) DEFAULT 1,
  created_by   INT UNSIGNED,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)    REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS scheduled_reports (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  template_id    INT UNSIGNED NOT NULL,
  frequency      ENUM('Daily','Weekly','Monthly') DEFAULT 'Monthly',
  next_run_at    DATETIME,
  last_run_at    DATETIME,
  recipients     JSON COMMENT 'Array of email addresses',
  is_active      TINYINT(1) DEFAULT 1,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES report_templates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED,
  user_id     INT UNSIGNED,
  action      VARCHAR(100) NOT NULL,
  module      VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id   INT UNSIGNED,
  old_values  JSON,
  new_values  JSON,
  ip_address  VARCHAR(50),
  user_agent  VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_module (module),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL,
  body        TEXT,
  type        VARCHAR(100),
  link        VARCHAR(500),
  is_read     TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_read (user_id, is_read),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SAMPLE DATA
-- ============================================================
INSERT INTO organizations (name, code, industry, address, city, state, country, phone, email) VALUES
('AGS Health Solutions Pvt Ltd', 'AGSHS', 'Healthcare', '12th Floor, Tech Park, Whitefield', 'Bengaluru', 'Karnataka', 'India', '+91-80-4567-8900', 'info@agshealth.com');

INSERT INTO roles (org_id, name, slug, is_system) VALUES
(1, 'Super Admin', 'super-admin', 1),
(1, 'HR Manager', 'hr-manager', 1),
(1, 'HR Executive', 'hr-executive', 1),
(1, 'Manager', 'manager', 1),
(1, 'Employee', 'employee', 1),
(1, 'Finance', 'finance', 1),
(1, 'L&D Manager', 'ld-manager', 1);

INSERT INTO permissions (module, action, slug) VALUES
('employees','read','employees:read'),('employees','create','employees:create'),
('employees','update','employees:update'),('employees','delete','employees:delete'),
('attendance','read','attendance:read'),('attendance','manage','attendance:manage'),
('payroll','read','payroll:read'),('payroll','process','payroll:process'),
('lms','read','lms:read'),('lms','manage','lms:manage'),
('recruitment','read','recruitment:read'),('recruitment','manage','recruitment:manage'),
('training','read','training:read'),('training','manage','training:manage'),
('performance','read','performance:read'),('performance','manage','performance:manage'),
('analytics','read','analytics:read'),
('ai','use','ai:use'),
('reports','read','reports:read'),('reports','manage','reports:manage');

INSERT INTO users (org_id, email, password_hash, first_name, last_name, is_active, is_email_verified) VALUES
(1, 'admin@agshealth.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/Mq9CIyO', 'System', 'Admin', 1, 1),
(1, 'hr@agshealth.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/Mq9CIyO', 'Priya', 'Sharma', 1, 1),
(1, 'employee@agshealth.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/Mq9CIyO', 'Rahul', 'Verma', 1, 1);

INSERT INTO user_roles (user_id, role_id) VALUES (1,1),(2,2),(3,5);

INSERT INTO departments (org_id, name, code) VALUES
(1,'Human Resources','HR'),(1,'Information Technology','IT'),
(1,'Finance & Accounts','FIN'),(1,'Clinical Operations','CLN'),
(1,'Radiology','RAD'),(1,'Pharmacy','PHR'),(1,'Administration','ADM');

INSERT INTO designations (org_id, dept_id, name, level) VALUES
(1,1,'HR Manager',5),(1,1,'HR Executive',2),(1,2,'Software Engineer',2),
(1,2,'Senior Software Engineer',3),(1,2,'Tech Lead',4),(1,4,'Staff Nurse',2),
(1,4,'Senior Nurse',3),(1,4,'Head Nurse',5),(1,5,'Radiologist',4);

INSERT INTO shifts (org_id, name, start_time, end_time) VALUES
(1,'General Shift','09:00:00','18:00:00'),
(1,'Morning Shift','06:00:00','14:00:00'),
(1,'Evening Shift','14:00:00','22:00:00'),
(1,'Night Shift','22:00:00','06:00:00');

INSERT INTO leave_types (org_id, name, code, days_per_year, is_paid, carry_forward) VALUES
(1,'Casual Leave','CL',12,1,0),(1,'Sick Leave','SL',12,1,0),
(1,'Earned Leave','EL',15,1,1),(1,'Maternity Leave','ML',180,1,0),
(1,'Paternity Leave','PL',15,1,0),(1,'Compensatory Off','CO',0,1,0);

INSERT INTO holidays (org_id, name, date, type) VALUES
(1,'Republic Day','2024-01-26','National'),(1,'Holi','2024-03-25','National'),
(1,'Good Friday','2024-03-29','National'),(1,'Independence Day','2024-08-15','National'),
(1,'Gandhi Jayanti','2024-10-02','National'),(1,'Diwali','2024-11-01','National'),
(1,'Christmas','2024-12-25','National');

SET FOREIGN_KEY_CHECKS = 1;
