require('dotenv').config();
const { sequelize, connectDB } = require('../config/database');
const User = require('../models/User');
const Department = require('../models/Department');
const Designation = require('../models/Designation');

const seed = async () => {
  await connectDB();

  console.log('🌱 Running database seed...');

  // Create tables
  await sequelize.sync({ alter: false });

  // Seed departments
  const depts = await Promise.all([
    Department.findOrCreate({ where: { name: 'Nursing', org_id: 1 }, defaults: { code: 'NRS', org_id: 1, is_active: 1 } }),
    Department.findOrCreate({ where: { name: 'Administration', org_id: 1 }, defaults: { code: 'ADM', org_id: 1, is_active: 1 } }),
    Department.findOrCreate({ where: { name: 'Information Technology', org_id: 1 }, defaults: { code: 'IT', org_id: 1, is_active: 1 } }),
    Department.findOrCreate({ where: { name: 'Finance', org_id: 1 }, defaults: { code: 'FIN', org_id: 1, is_active: 1 } }),
    Department.findOrCreate({ where: { name: 'Human Resources', org_id: 1 }, defaults: { code: 'HR', org_id: 1, is_active: 1 } }),
    Department.findOrCreate({ where: { name: 'Operations', org_id: 1 }, defaults: { code: 'OPS', org_id: 1, is_active: 1 } }),
  ]);

  console.log('Departments seeded');

  // Seed designations
  await Promise.all([
    Designation.findOrCreate({ where: { name: 'Software Engineer', dept_id: depts[2][0].id }, defaults: { org_id: 1, dept_id: depts[2][0].id, level: 3, is_active: 1 } }),
    Designation.findOrCreate({ where: { name: 'Senior Software Engineer', dept_id: depts[2][0].id }, defaults: { org_id: 1, dept_id: depts[2][0].id, level: 4, is_active: 1 } }),
    Designation.findOrCreate({ where: { name: 'HR Manager', dept_id: depts[4][0].id }, defaults: { org_id: 1, dept_id: depts[4][0].id, level: 5, is_active: 1 } }),
    Designation.findOrCreate({ where: { name: 'Staff Nurse', dept_id: depts[0][0].id }, defaults: { org_id: 1, dept_id: depts[0][0].id, level: 2, is_active: 1 } }),
    Designation.findOrCreate({ where: { name: 'Finance Analyst', dept_id: depts[3][0].id }, defaults: { org_id: 1, dept_id: depts[3][0].id, level: 3, is_active: 1 } }),
  ]);

  console.log(' Designations seeded');

  // Seed admin user
  const adminExists = await User.findOne({ where: { email: 'admin@agshealth.com', org_id: 1 } });
  if (!adminExists) {
    await User.create({
      org_id: 1,
      email: 'admin@agshealth.com',
      password_hash: 'Admin@123',
      first_name: 'System',
      last_name: 'Administrator',
      is_active: 1,
      is_email_verified: 1,
    });
    console.log(' Admin user created: admin@agshealth.com / Admin@123');
  } else {
    console.log(' Admin user already exists');
  }

  // Create roles & permissions tables (raw SQL for speed)
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      org_id INT UNSIGNED NOT NULL DEFAULT 1,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_slug (slug)
    ) ENGINE=InnoDB;
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) NOT NULL,
      module VARCHAR(100),
      UNIQUE KEY uniq_slug (slug)
    ) ENGINE=InnoDB;
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      role_id INT UNSIGNED NOT NULL,
      UNIQUE KEY uniq_user_role (user_id, role_id)
    ) ENGINE=InnoDB;
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      role_id INT UNSIGNED NOT NULL,
      permission_id INT UNSIGNED NOT NULL,
      UNIQUE KEY uniq_rp (role_id, permission_id)
    ) ENGINE=InnoDB;
  `);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS salary_structures (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      employee_id INT UNSIGNED NOT NULL,
      effective_from DATE,
      basic_salary DECIMAL(12,2) DEFAULT 0,
      hra DECIMAL(12,2) DEFAULT 0,
      transport_allowance DECIMAL(12,2) DEFAULT 0,
      medical_allowance DECIMAL(12,2) DEFAULT 0,
      special_allowance DECIMAL(12,2) DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // Insert super-admin role
  await sequelize.query(`
    INSERT IGNORE INTO roles (org_id, name, slug) VALUES (1, 'Super Administrator', 'super-admin');
  `);

  // Assign role to admin user
  const admin = await User.findOne({ where: { email: 'admin@agshealth.com' } });
  const [roleRows] = await sequelize.query('SELECT id FROM roles WHERE slug = "super-admin" LIMIT 1');
  if (admin && roleRows.length) {
    await sequelize.query(`INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (:uid, :rid)`, {
      replacements: { uid: admin.id, rid: roleRows[0].id },
    });
    console.log(' Super-admin role assigned');
  }

  console.log('\n Seed completed! Login with admin@agshealth.com / Admin@123\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
