const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return successResponse(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        roles: result.roles,
        permissions: result.permissions,
        avatarUrl: result.user.avatar_url,
      },
    }, 'Login successful');
  } catch (err) {
    return errorResponse(res, err.message, err.statusCode || 500);
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, 'Refresh token required', 400);
    const result = await authService.refreshTokens(refreshToken);
    return successResponse(res, result, 'Token refreshed');
  } catch (err) {
    return errorResponse(res, err.message, err.statusCode || 401);
  }
};

const logout = async (req, res) => {
  try {
    await authService.logoutUser(req.user.id);
    return successResponse(res, {}, 'Logged out successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return successResponse(res, {}, 'If your email exists, a reset link has been sent');
  } catch (err) {
    return errorResponse(res, err.message, err.statusCode || 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return successResponse(res, {}, 'Password reset successful');
  } catch (err) {
    return errorResponse(res, err.message, err.statusCode || 400);
  }
};

const getMe = async (req, res) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'avatar_url', 'last_login', 'mfa_enabled'],
    });
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, { user, roles: req.user.roles, permissions: req.user.permissions });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { User } = require('../models');
    const user = await User.findByPk(req.user.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return errorResponse(res, 'Current password is incorrect', 400);
    const hashed = await User.hashPassword(newPassword);
    await user.update({ password_hash: hashed });
    return successResponse(res, {}, 'Password changed successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = { login, refresh, logout, forgotPassword, resetPassword, getMe, changePassword };
