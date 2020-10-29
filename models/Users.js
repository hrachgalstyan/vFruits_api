const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please tell us your first name"]
  },
  last_name: {
    type: String,
    required: [true, "Please tell us your last name"]
  },
  email: { 
    type: String, 
    unique: true,
    required: [true, "Please provide an email address"],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phoneNumber: { 
    type: String, 
    unique: true,
    required: [true, "Please tell us your phone number"]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  verifyCode: {
    type: String,
    default: Math.floor(100000 + Math.random() * 900000)
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  bonus: { 
    type: Number, 
    default: 0 
  },
  addresses: [{
    address: { type: String, index: true },
    notes: String,
    orderCount: 0,
  }],
  orderCount: {
    type: Number,
    default: 0
  },
  firstOrder: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
  last_login: { type: Date, default: new Date(Date.now() + 14400000) },
  updated_at: { type: Date, default: new Date(Date.now() + 14400000) },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('orders', {
  ref: "ShopOrders",
  foreignField: "user",
  localField: "_id"
});

userSchema.pre(/^find/, function (next) {
  this.populate({
      path: 'orders'
  });
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified.
  if (!this.isModified('password')) return next();

  // Hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const {orderCount} = this.getUpdate();
  if(orderCount !== 0){
    this.update({firstOrder: false});
    return next();
  }
  this.update({firstOrder: true});
  next();
});

userSchema.pre(['findOne', 'findOneAndUpdate'], function (next) {
  // this points to the current query
  this.find({
    active: {
      $ne: false
    }
  });
  next();
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 14400000 + 600000);

  return resetToken;
};

const Users = mongoose.model('Users', userSchema);

module.exports = Users;