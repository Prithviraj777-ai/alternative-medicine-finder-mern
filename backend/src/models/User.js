const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ─── User Schema ───────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// ─── Pre-save: Hash password before saving ─────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified (avoids re-hashing on profile updates)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: Compare entered password with stored hash ─
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance method: Generate & hash reset token ───────────────
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random 20-byte token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and store in DB (never store plain token)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiry to 10 minutes from now
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Return the un-hashed token (sent via email)
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
