const mongoose = require('mongoose');
const helpers = require('../helpers');
const ActivityLogs = require('./ActivityLogs');

const changeLogsSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.ObjectId, ref: 'Admins' },
  target_model: {type: String},
  action_type: { type: String, index: true}, // ChangeLogs Name
  description: {type: String},

  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
});

// QUERY MIDDLEWARE
changeLogsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'admin',
    select: 'username'
  });
  next();
});

const ChangeLogs = mongoose.model('ChangeLogs', changeLogsSchema);

module.exports = ChangeLogs;