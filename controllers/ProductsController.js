const Products = require('../models/Products');
const Factory = require('./HandlerFactory');

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

exports.getAll = Factory.getAll(Products);
exports.createProduct = Factory.createOne(Products);
exports.getProduct = Factory.getOne(Products, {path: 'ChangeLogs'});
exports.updateProduct = Factory.updateOne(Products);;
exports.deleteProduct = Factory.deleteOne(Products);

