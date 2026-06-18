const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

/**
 * Runs express-validator checks and returns 422 if any fail.
 * Place after any express-validator check arrays in route.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
      value: e.value,
    }));
    return errorResponse(res, 'Validation failed', 422, formatted);
  }
  next();
};

module.exports = validate;
