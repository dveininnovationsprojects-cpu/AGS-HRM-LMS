const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  org_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(30) },
  avatar_url: { type: DataTypes.STRING(500) },
  is_active: { type: DataTypes.TINYINT(1), defaultValue: 1 },
  is_email_verified: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  mfa_enabled: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  refresh_token_hash: { type: DataTypes.STRING(255) },
  last_login: { type: DataTypes.DATE },
  password_reset_token: { type: DataTypes.STRING(100) },
  password_reset_expires: { type: DataTypes.DATE },
  failed_login_attempts: { type: DataTypes.TINYINT, defaultValue: 0 },
  locked_until: { type: DataTypes.DATE },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['org_id', 'email'] },
    { fields: ['email'] },
  ],
});

// Virtual: full name
User.prototype.getFullName = function () {
  return [this.first_name, this.last_name].filter(Boolean).join(' ');
};

// Instance method: compare password
User.prototype.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password_hash);
};

// Static: hash password
User.hashPassword = async (plain) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return bcrypt.hash(plain, rounds);
};

// Before create hook — hash password
User.beforeCreate(async (user) => {
  if (user.password_hash && !user.password_hash.startsWith('$2')) {
    user.password_hash = await User.hashPassword(user.password_hash);
  }
});

// Before update hook — rehash if password changed
User.beforeUpdate(async (user) => {
  if (user.changed('password_hash') && !user.password_hash.startsWith('$2')) {
    user.password_hash = await User.hashPassword(user.password_hash);
  }
});

module.exports = User;
