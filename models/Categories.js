const mongoose = require('mongoose');
const helpers = require('../helpers');
const ActivityLogs = require('./ActivityLogs');

const categorySchema = new mongoose.Schema({
  nameAm: {
    type: String,
    required: true,
    unique: true
  },
  nameEn: String,
  nameRu: String,
  slug: { type: String, unique: true, required: true },
  order: {type: Number, default: 0},

  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
  updated_at: Date,
});

categorySchema.pre(/^save/, async function(next) {
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.CATEGORY_CREATE,
    description: `Category "${this.nameAm}" created!`
  });
  helpers.sendToTelegram(`Category "${this.nameAm}" created!🥳`);
  next();
});

categorySchema.pre(/^findOneAndUpdate/, async function(next) {
  const {nameAm} = await this.model.findOne(this.getQuery());
  if(nameAm){
    await ActivityLogs.create({
      admin: "5f8a0a8cb68b0e012ce2c846",
      type: helpers.ACTIVITY_LOGS_STATUS_TYPES.CATEGORY_UPDATE,
      description: `Category "${nameAm}" updated!`
    });
    helpers.sendToTelegram(`Category "${nameAm}" updated!🤗`);
  }
  next();
});

const Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories;