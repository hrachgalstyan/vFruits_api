const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const Admins = require('../models/Admins');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({
      id,
    },
    process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  admin.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newAdmin = await Admins.create(req.body);
  createSendToken(newAdmin, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if admin exists && password is correct
  const admin = await Admins.findOne({
    username
  }).select('+password');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  await Admins.findOneAndUpdate(username, {last_login: new Date(Date.now() + 14400000)}, {useFindAndModify: false});

  // 3) If everything ok, send token to client
  createSendToken(admin, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError('You are not logged in.', 401)
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if admin still exists
  const currentAdmin = await Admins.findById(decoded.id);
  if (!currentAdmin) {
    return next(
      new AppError(
        'The admin belonging to this token does no longer exist.',
        401
      )
    );
  }

  // Check if admin changed password after the token was issued
  if (currentAdmin.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Admin recently changed password! Please log in again', 401)
    );
  }
  req.admin = currentAdmin;
  res.locals.admin = currentAdmin;
  return next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if admin still exists
      const currentAdmin = await Admins.findById(decoded.id);
      if (!currentAdmin) {
        return next();
      }

      // 3) Check if admin changed password after the token was issued
      if (currentAdmin.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN ADMIN
      res.locals.admin = currentAdmin;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin']. role='admin'
    if (!roles.includes(req.admin.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};


exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get admin from collection
  const admin = await Admins.findById(req.admin.id).select('+password');

  // 2) Check if POSTed password is correct
  if (!(await admin.correctPassword(req.body.passwordCurrent, admin.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) If so, update password
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  await admin.save();

  // 4) Log the admin in, send JWT
  createSendToken(admin, 200, res);
})