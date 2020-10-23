const Admins = require('../models/Admins');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./HandlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.admin.id;
  next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates! Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to updated
  const filteredBody = filterObj(req.body, 'name', 'username');

  // 3) Update user data
  const updatedAdmin = await Admins.findByIdAndUpdate(req.admin.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      admin: updatedAdmin
    }
  })
});

exports.getAll = Factory.getAll(Admins, { role: { $ne: "super_admin" } });
exports.createAdmin = Factory.createOne(Admins);;
exports.getOne = Factory.getOne(Admins);
exports.updateAdmin = Factory.updateOne(Admins);
exports.deleteAdmin = Factory.deleteOne(Admins);