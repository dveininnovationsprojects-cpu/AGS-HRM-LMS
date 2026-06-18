const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');
const ExcelJS = require('exceljs');

router.use(authenticate);

router.get('/employees/excel', async (req, res) => {
  try {
    const { Employee, Department, Designation } = require('../models');
    const employees = await Employee.findAll({
      where: { org_id: req.user.org_id, is_active: 1 },
      include: [
        { model: Department, as: 'department', attributes: ['name'] },
        { model: Designation, as: 'designation', attributes: ['title'] },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AGS HRM-LMS';
    const sheet = workbook.addWorksheet('Employees');

    sheet.columns = [
      { header: 'Emp Code', key: 'emp_code', width: 15 },
      { header: 'First Name', key: 'first_name', width: 18 },
      { header: 'Last Name', key: 'last_name', width: 18 },
      { header: 'Work Email', key: 'work_email', width: 25 },
      { header: 'Department', key: 'dept', width: 20 },
      { header: 'Designation', key: 'desig', width: 20 },
      { header: 'Status', key: 'employment_status', width: 15 },
      { header: 'Type', key: 'employment_type', width: 15 },
      { header: 'Date of Joining', key: 'date_of_joining', width: 18 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04549B' } };

    employees.forEach(emp => {
      sheet.addRow({
        emp_code: emp.emp_code,
        first_name: emp.first_name,
        last_name: emp.last_name || '',
        work_email: emp.work_email,
        dept: emp.department?.name || '',
        desig: emp.designation?.title || '',
        employment_status: emp.employment_status,
        employment_type: emp.employment_type,
        date_of_joining: emp.date_of_joining,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="employees.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

router.get('/payroll/excel', async (req, res) => {
  try {
    const { PayrollRecord, Employee } = require('../models');
    const { month, year } = req.query;
    const where = {};
    if (month) where.month = month;
    if (year) where.year = year;
    const records = await PayrollRecord.findAll({
      where,
      include: [{ model: Employee, as: 'employee', attributes: ['first_name', 'last_name', 'emp_code'] }],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Payroll');
    sheet.columns = [
      { header: 'Emp Code', key: 'emp_code', width: 15 },
      { header: 'Name', key: 'name', width: 22 },
      { header: 'Month', key: 'month', width: 10 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Gross Salary', key: 'gross_salary', width: 15 },
      { header: 'Deductions', key: 'total_deductions', width: 15 },
      { header: 'Net Salary', key: 'net_salary', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
    ];
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04549B' } };

    records.forEach(r => {
      sheet.addRow({
        emp_code: r.employee?.emp_code,
        name: `${r.employee?.first_name} ${r.employee?.last_name || ''}`,
        month: r.month, year: r.year,
        gross_salary: r.gross_salary,
        total_deductions: r.total_deductions,
        net_salary: r.net_salary,
        status: r.status,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="payroll.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

module.exports = router;
