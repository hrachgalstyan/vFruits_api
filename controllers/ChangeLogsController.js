const ChangeLogs = require('../models/ChangeLogs');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(ChangeLogs);
exports.createChangeLog = Factory.createOne(ChangeLogs);
exports.getChangeLog = Factory.getOne(ChangeLogs);
exports.updateChangeLog = Factory.updateOne(ChangeLogs);
exports.deleteChangeLog = Factory.deleteOne(ChangeLogs);