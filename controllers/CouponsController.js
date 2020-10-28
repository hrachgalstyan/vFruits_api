const Coupons = require('../models/Coupons');
const Factory = require('./HandlerFactory');
const ActivityLogs = require('../models/ActivityLogs');
const ChangeLogs = require('../models/ChangeLogs');
const catchAsync = require('../utils/catchAsync');
const helpers = require('../helpers');

exports.createCoupon = catchAsync(async (req, res, next) => {
  const doc = await Coupons.create(req.body);
  if(doc){
    await ActivityLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      type: helpers.ACTIVITY_LOGS_STATUS_TYPES.COUPON_CREATE,
      description: `Coupon "${doc.name}" created!`
    });
    helpers.sendToTelegram(`Coupon "${doc.name}" created! 💵`);
  }
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  req.body.updated_at = new Date(Date.now() + 14400000);
  const last = await Coupons.findById(req.params.id);
  const doc = await Coupons.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  const options = Object.keys(req.body);

  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }

  await ChangeLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    target_model: helpers.CHANGE_LOGS_TARGETS.COUPON,
    action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.COUPON_UPDATE,
    description: `Coupon ${last.name} updated! ${options[0]} changed from "${last[options[0]]}" to "${doc[options[0]]}".`
  });

  helpers.sendToTelegram(`Coupon <b>${last.name}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n<b>${options[0]}</b> changed from: <strike>${last[options[0]]}</strike> to: <i>${doc[options[0]]}</i>.`);
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const doc = await Coupons.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.COUPON_DELETE,
    description: `Coupon "${doc.name}" deleted!`
  });
  helpers.sendToTelegram(`Coupon "${doc.name}" deleted!🥺`);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAll = Factory.getAll(Coupons);
exports.getCoupon = Factory.getOne(Coupons);