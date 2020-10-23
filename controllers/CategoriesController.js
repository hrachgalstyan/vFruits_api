const Categories = require('../models/Categories');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(Categories);
exports.createCategory = Factory.createOne(Categories);
exports.getCategory = Factory.getOne(Categories);
exports.updateCategory = Factory.updateOne(Categories);
exports.deleteCategory = Factory.deleteOne(Categories);