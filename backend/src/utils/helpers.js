const crypto = require('crypto');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('./constants');

/**
 * Standard API success response
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard API error response
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

/**
 * Extract pagination params from query
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build pagination meta
 */
const buildPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
});

/**
 * Generate employee code
 */
const generateEmpCode = (orgCode, sequential) => {
  const seq = String(sequential).padStart(4, '0');
  return `${orgCode}-${seq}`;
};

/**
 * Generate random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a value with SHA-256
 */
const hashValue = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

/**
 * Sanitize string (trim + lowercase)
 */
const sanitize = (str) => (str ? String(str).trim().toLowerCase() : '');

/**
 * Calculate number of working days between two dates (excluding weekends)
 */
const getWorkingDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

/**
 * Format currency (INR)
 */
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Mask sensitive data
 */
const maskString = (str, visibleChars = 4) => {
  if (!str) return '';
  const len = str.length;
  if (len <= visibleChars) return '*'.repeat(len);
  return '*'.repeat(len - visibleChars) + str.slice(-visibleChars);
};

/**
 * Deep clone an object
 */
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Convert camelCase to snake_case
 */
const toSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Convert snake_case to camelCase
 */
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Get fiscal year
 */
const getFiscalYear = (date = new Date(), fiscalStartMonth = 4) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month >= fiscalStartMonth) {
    return `${year}-${String(year + 1).slice(-2)}`;
  }
  return `${year - 1}-${String(year).slice(-2)}`;
};

/**
 * Validate email
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = {
  successResponse,
  errorResponse,
  getPagination,
  buildPaginationMeta,
  generateEmpCode,
  generateToken,
  hashValue,
  sanitize,
  getWorkingDays,
  formatCurrency,
  maskString,
  deepClone,
  sleep,
  toSnakeCase,
  toCamelCase,
  getFiscalYear,
  isValidEmail,
};
