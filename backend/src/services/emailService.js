const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    const info = await getTransporter().sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'AGS Health HRM'}" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@agshealth.com'}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
      attachments,
    });
    logger.info(`Email sent: ${info.messageId} to ${to}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'AGS Health — Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #04549B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">AGS Health HRM</h1>
        </div>
        <div style="padding: 32px; background: #fff;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.first_name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: #04549B; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
          <p style="color: #666; font-size: 12px;">Or copy this URL: ${resetUrl}</p>
        </div>
        <div style="padding: 16px; background: #f8fafc; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} AGS Health Solutions. All rights reserved.
        </div>
      </div>
    `,
  });
};

const sendWelcomeEmail = async (user, tempPassword) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to AGS Health Workforce Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #04549B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">AGS Health HRM</h1>
        </div>
        <div style="padding: 32px; background: #fff;">
          <h2>Welcome, ${user.first_name}!</h2>
          <p>Your account has been created. Here are your login credentials:</p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p>Please log in and change your password immediately.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="background: #04549B; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none;">Login Now</a>
          </div>
        </div>
      </div>
    `,
  });
};

const sendLeaveNotification = async (managerEmail, employee, leaveRequest) => {
  await sendEmail({
    to: managerEmail,
    subject: `Leave Request from ${employee.first_name} ${employee.last_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #04549B; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Leave Request Notification</h2>
        </div>
        <div style="padding: 24px; background: #fff;">
          <p>${employee.first_name} ${employee.last_name} has submitted a leave request:</p>
          <ul>
            <li><strong>From:</strong> ${leaveRequest.from_date}</li>
            <li><strong>To:</strong> ${leaveRequest.to_date}</li>
            <li><strong>Days:</strong> ${leaveRequest.days}</li>
            <li><strong>Reason:</strong> ${leaveRequest.reason}</li>
          </ul>
          <p>Please review and approve/reject in the HRM portal.</p>
        </div>
      </div>
    `,
  });
};

const sendPayslipEmail = async (employee, payslipBuffer, period) => {
  await sendEmail({
    to: employee.work_email,
    subject: `Your Payslip for ${period}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #04549B; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Salary Slip — ${period}</h2>
        </div>
        <div style="padding: 24px; background: #fff;">
          <p>Dear ${employee.first_name},</p>
          <p>Please find your payslip for ${period} attached to this email.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `Payslip_${period.replace(' ', '_')}.pdf`,
        content: payslipBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLeaveNotification,
  sendPayslipEmail,
};
