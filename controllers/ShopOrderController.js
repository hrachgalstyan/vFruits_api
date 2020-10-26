const ShopOrders = require('../models/ShopOrders');
const Products = require('../models/Products');
const Factory = require('./HandlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAll = Factory.getAll(ShopOrders);
exports.createShopOrder = catchAsync(async (req, res, next) => {
  const products = req.body.products;
  const doc = await ShopOrders.create(req.body);
  for(var i = 0; i < products.length; i++){
    await Products.findByIdAndUpdate(products[i]._id, {
      $inc: {orderCount: 1}
    }, {
      useFindAndModify: false
    })
  }
  res.status(201).json({
      status: 'success',
      data: {
          data: doc,
      },
  });
});
exports.getShopOrder = Factory.getOne(ShopOrders, {path: 'Payments'});
exports.updateShopOrder = Factory.updateOne(ShopOrders);
exports.deleteShopOrder = Factory.deleteOne(ShopOrders);