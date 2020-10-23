const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.ObjectId, ref: 'Admins' },
  type: { type: String, index: true }, // Activity Name
  description: String,
  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
});

// QUERY MIDDLEWARE
activitySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'admin',
    select: 'username'
  });
  next();
});

const ActivityLogs = mongoose.model('Activitylogs', activitySchema);

module.exports = ActivityLogs;