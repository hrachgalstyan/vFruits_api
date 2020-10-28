const Products = require('../models/Products');
const Factory = require('./HandlerFactory');
const Categories = require('../models/Categories');
const ActivityLogs = require('../models/ActivityLogs');
const ChangeLogs = require('../models/ChangeLogs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const helpers = require('../helpers');

exports.aliasNewProducts = (req, res, next) => {
  req.query.limit = '4';
  req.query.sort = '-created_at';
  req.query.fields = 'nameAm,photo,price,unit,rate,-category,-change_logs';
  next();
}

exports.aliasBestSale = (req, res, next) => {
  req.query.limit = '8';
  req.query.sort = '-orderCount,rate,price';
  req.query.fields = 'nameAm,photo,price,unit,rate,orderCount,-category,-change_logs';
  next();
}

exports.createProduct = catchAsync(async (req, res, next) => {
  const doc = await Products.create(req.body);
  if(doc){
    await Categories.findByIdAndUpdate(doc.category, {
      $inc: {productsCount: 1}
    }, {
      useFindAndModify: false
    })
    await ActivityLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      type: helpers.ACTIVITY_LOGS_STATUS_TYPES.PRODUCT_CREATE,
      description: `Product "${doc.nameAm}" created!`
    });
    helpers.sendToTelegram(`Product "${doc.nameAm}" created! 😍`);
  }
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});;

exports.updateProduct = catchAsync(async (req, res, next) => {
  req.body.updated_at = new Date(Date.now() + 14400000);
  const last = await Products.findById(req.params.id);
  const doc = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  const options = Object.keys(req.body);

  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }
  
  if (!('orderCount' in req.body)){
    await ChangeLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      product: doc._id,
      target_model: helpers.CHANGE_LOGS_TARGETS.PRODUCT,
      action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.PRODUCT_UPDATE,
      description: `Product ${last.nameAm} updated! ${options[0]} changed from "${last[options[0]]}" to "${doc[options[0]]}".`
    });
    helpers.sendToTelegram(`Product <b>${last.nameAm}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n<b>${options[0]}</b> changed from: <strike>${last[options[0]]}</strike> to: <i>${doc[options[0]]}</i>.`);
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const doc = await Products.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.PRODUCT_DELETE,
    description: `Product "${doc.name}" deleted!`
  });
  helpers.sendToTelegram(`Product "${doc.name}" deleted!🥺`);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAll = Factory.getAll(Products);
exports.getProduct = Factory.getOne(Products, {path: 'ChangeLogs'});

