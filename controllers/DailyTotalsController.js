const DailyTotals = require('../models/DailyTotals');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(DailyTotals);