const Users = require('../models/Users');
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
  req.params.id = req.user.id;
  next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates! Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to updated
  const filteredBody = filterObj(req.body, 'first_name', 'last_name', 'email', 'phoneNumber', 'addresses');

  filteredBody.updated_at = new Date(Date.now() + 14400000);
  // 3) Update user data
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, {
    active: false
  });

  res.status(204).json({
    status: 'success',
    data: null
  })
});

exports.getAll = Factory.getAll(Users);
exports.createUser = Factory.createOne(Users);;
exports.getOne = Factory.getOne(Users, {path: 'ShopOrders'});
exports.updateUser = Factory.updateOne(Users);
exports.deleteUser = Factory.deleteOne(Users);

exports.addAddress = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'address', 'notes', 'orderCount');
  let user = await Users.findByIdAndUpdate(req.user._id, {
    $push: {addresses: filteredBody}
  },
  {new: true, upsert: true, useFindAndModify: false, runValidators: true});

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user._id, {
    $pull: {addresses: {_id: req.params.id}}
  },
  {new: true, upsert: true, useFindAndModify: false, runValidators: true});

  res.status(200).json({
    status: 'success',
    data: null
  })
});