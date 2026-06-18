const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { generateToken, hashValue } = require('../utils/helpers');
const logger = require('../utils/logger');

const generateTokens = (user, permissions, roles) => {
  const payload = {
    id: user.id,
    org_id: user.org_id,
    email: user.email,
    permissions,
    roles,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign(
    { id: user.id, org_id: user.org_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const getUserPermissionsAndRoles = async (userId) => {
  const { sequelize } = require('../config/database');

  // QueryTypes.SELECT returns rows directly (not [rows, meta])
  const rows = await sequelize.query(
    `SELECT DISTINCT r.slug as role_slug, p.slug as perm_slug
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON rp.permission_id = p.id
     WHERE ur.user_id = :userId`,
    { replacements: { userId }, type: sequelize.QueryTypes.SELECT }
  );

  const safeRows = Array.isArray(rows) ? rows : [];
  const roles = [...new Set(safeRows.map((r) => r.role_slug).filter(Boolean))];
  const permissions = [...new Set(safeRows.map((r) => r.perm_slug).filter(Boolean))];

  return { roles, permissions };
};

const loginUser = async (email, password, orgId = 1) => {
  const user = await User.findOne({ where: { email, org_id: orgId } });

  if (!user) throw { statusCode: 401, message: 'Invalid email or password' };
  if (!user.is_active) throw { statusCode: 403, message: 'Account is deactivated' };

  // Check lockout
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    throw { statusCode: 423, message: 'Account is temporarily locked. Try again later.' };
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    const attempts = (user.failed_login_attempts || 0) + 1;
    const updates = { failed_login_attempts: attempts };
    if (attempts >= 5) {
      updates.locked_until = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    }
    await user.update(updates);
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  // Reset failed attempts
  await user.update({
    failed_login_attempts: 0,
    locked_until: null,
    last_login: new Date(),
  });

  const { roles, permissions } = await getUserPermissionsAndRoles(user.id);
  const { accessToken, refreshToken } = generateTokens(user, permissions, roles);

  // Store hashed refresh token
  await user.update({ refresh_token_hash: hashValue(refreshToken) });

  return { user, accessToken, refreshToken, roles, permissions };
};

const refreshTokens = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw { statusCode: 401, message: 'Invalid or expired refresh token' };
  }

  const user = await User.findByPk(decoded.id);
  if (!user || !user.is_active) {
    throw { statusCode: 401, message: 'User not found or inactive' };
  }

  if (user.refresh_token_hash !== hashValue(refreshToken)) {
    throw { statusCode: 401, message: 'Refresh token reuse detected' };
  }

  const { roles, permissions } = await getUserPermissionsAndRoles(user.id);
  const tokens = generateTokens(user, permissions, roles);

  await user.update({ refresh_token_hash: hashValue(tokens.refreshToken) });

  return { ...tokens, roles, permissions };
};

const logoutUser = async (userId) => {
  await User.update({ refresh_token_hash: null }, { where: { id: userId } });
};

const forgotPassword = async (email, orgId = 1) => {
  const user = await User.findOne({ where: { email, org_id: orgId } });
  if (!user) {
    // Don't reveal if user exists
    logger.info(`Password reset requested for non-existent email: ${email}`);
    return null;
  }

  const resetToken = generateToken(32);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.update({
    password_reset_token: hashValue(resetToken),
    password_reset_expires: expires,
  });

  return { user, resetToken };
};

const resetPassword = async (token, newPassword, orgId = 1) => {
  const hashedToken = hashValue(token);
  const user = await User.findOne({
    where: {
      password_reset_token: hashedToken,
      org_id: orgId,
    },
  });

  if (!user) throw { statusCode: 400, message: 'Invalid or expired reset token' };
  if (new Date(user.password_reset_expires) < new Date()) {
    throw { statusCode: 400, message: 'Reset token has expired' };
  }

  const hashed = await User.hashPassword(newPassword);
  await user.update({
    password_hash: hashed,
    password_reset_token: null,
    password_reset_expires: null,
    failed_login_attempts: 0,
    locked_until: null,
  });

  return user;
};

module.exports = {
  loginUser,
  refreshTokens,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserPermissionsAndRoles,
};
