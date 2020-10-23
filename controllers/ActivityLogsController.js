const ActivityLogs = require('../models/ActivityLogs');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(ActivityLogs);
exports.createActivityLog = Factory.createOne(ActivityLogs);
exports.getActivityLog = Factory.getOne(ActivityLogs);
exports.updateActivityLog = Factory.updateOne(ActivityLogs);
exports.deleteActivityLog = Factory.deleteOne(ActivityLogs);