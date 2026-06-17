const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Verify JWT access token
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Access token required', 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid access token', 401);
    }
    logger.error('Auth middleware error:', error);
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * RBAC permission check middleware factory
 * Usage: requirePermission('employees:read')
 */
const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthenticated', 401);
    }

    const userPermissions = req.user.permissions || [];
    const userRoles = req.user.roles || [];

    // Super admin bypasses all permission checks
    if (userRoles.includes('super-admin')) {
      return next();
    }

    const hasPermission = permissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      logger.warn(`Permission denied: user=${req.user.id} required=${permissions.join(',')}`);
      return errorResponse(res, 'You do not have permission to perform this action', 403);
    }

    next();
  };
};

/**
 * Require specific roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthenticated', 401);
    }

    const userRoles = req.user.roles || [];
    if (userRoles.includes('super-admin')) return next();

    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return errorResponse(res, 'Insufficient role privileges', 403);
    }
    next();
  };
};

/**
 * Optional auth — sets req.user if token present but doesn't fail
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.substring(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // ignore invalid token in optional mode
  }
  next();
};

module.exports = { authenticate, requirePermission, requireRole, optionalAuth };
