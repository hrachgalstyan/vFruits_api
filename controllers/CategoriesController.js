const Categories = require('../models/Categories');
const ActivityLogs = require('../models/ActivityLogs');
const ChangeLogs = require('../models/ChangeLogs');
const Factory = require('./HandlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const helpers = require('../helpers');

exports.createCategory = catchAsync(async (req, res, next) => {
  const doc = await Categories.create(req.body);
  if(doc){
    await ActivityLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      type: helpers.ACTIVITY_LOGS_STATUS_TYPES.CATEGORY_CREATE,
      description: `Category "${doc.nameAm}" created!`
    });
    helpers.sendToTelegram(`Category "${doc.nameAm}" created!🥳`);
  }
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  req.body.updated_at = new Date(Date.now() + 14400000);
  const last = await Categories.findById(req.params.id);
  const doc = await Categories.findByIdAndUpdate(req.params.id, req.body, {
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
    target_model: helpers.CHANGE_LOGS_TARGETS.CATEGORY,
    action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.CATEGORY_UPDATE,
    description: `Category ${last.nameAm} updated! ${options[0]} changed from "${last[options[0]]}" to "${doc[options[0]]}".`
  });

  helpers.sendToTelegram(`Category <b>${last.nameAm}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n<b>${options[0]}</b> changed from: <strike>${last[options[0]]}</strike> to: <i>${doc[options[0]]}</i>.`);
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const doc = await Categories.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.CATEGORY_DELETE,
    description: `Category "${doc.nameAm}" deleted!`
  });
  helpers.sendToTelegram(`Category "${doc.nameAm}" deleted!🥺`);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAll = Factory.getAll(Categories);
exports.getCategory = Factory.getOne(Categories);