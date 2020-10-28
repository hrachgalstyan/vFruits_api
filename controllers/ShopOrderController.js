const ShopOrders = require('../models/ShopOrders');
const Products = require('../models/Products');
const Users = require('../models/Users');
const Factory = require('./HandlerFactory');
const catchAsync = require('../utils/catchAsync');
const helpers = require('../helpers');
const ActivityLogs = require('../models/ActivityLogs');

exports.createShopOrder = catchAsync(async (req, res, next) => {
  req.body.bonus = req.body.price * 0.02;
  const products = req.body.products;
  const doc = await ShopOrders.create(req.body);
  await Users.findByIdAndUpdate(req.body.user, {$inc: {bonus: req.body.bonus, orderCount: 1}}, {useFindAndModify: false});
  
  for(var i = 0; i < products.length; i++){
    await Products.findByIdAndUpdate(products[i]._id, {
      $inc: {orderCount: 1}
    }, {
      useFindAndModify: false
    })
  }
  
  helpers.sendToTelegram(`New Order\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍`);
  
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateShopOrder = catchAsync(async (req, res, next) => {
  req.body.updated_at = new Date(Date.now() + 14400000);
  if("price" in req.body){
    req.body.bonus = req.body.price * 0.02;
  }
  const last = await ShopOrders.findById(req.params.id);
  const doc = await ShopOrders.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  const options = Object.keys(req.body);

  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }

  if("price" in req.body){
    await Users.findByIdAndUpdate(doc.user, {$inc: {bonus: req.body.bonus - last.bonus}}, {useFindAndModify: false});
  }

  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    target_model: helpers.CHANGE_LOGS_TARGETS.SHOP_ORDER,
    action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.ORDER_UPDATE,
    description: `Order ${last.phoneNumber} updated! ${options[0]} changed from "${last[options[0]]}" to "${doc[options[0]]}".`
  });
  
  helpers.sendToTelegram(`Order <b>${last.phoneNumber}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n<b>${options[0]}</b> changed from: <strike>${last[options[0]]}</strike> to: <i>${doc[options[0]]}</i>.`);

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteShopOrder = catchAsync(async (req, res, next) => {
  const doc = await ShopOrders.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
  }
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.ORDER_DELETE,
    description: `Order "${doc.phoneNumber}" deleted!`
  });
  helpers.sendToTelegram(`Order "${doc.phoneNumber}" deleted!🥺`);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAll = Factory.getAll(ShopOrders);
exports.getShopOrder = Factory.getOne(ShopOrders, {path: 'Payments'});