const ShopOrders = require('../models/ShopOrders');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(ShopOrders);
exports.createShopOrder = Factory.createOne(ShopOrders);
exports.getShopOrder = Factory.getOne(ShopOrders, {path: 'Payments'});
exports.updateShopOrder = Factory.updateOne(ShopOrders);
exports.deleteShopOrder = Factory.deleteOne(ShopOrders);