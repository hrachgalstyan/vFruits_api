const mongoose = require('mongoose');
const helpers = require('../helpers');
const ActivityLogs = require('./ActivityLogs');
const ChangeLogs = require('./ChangeLogs');

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
  const doc = await this.model.findOne(this.getQuery());
  const options = await this.getUpdate();
  const docName = Object.keys(options);
  const log = await ChangeLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    target_model: helpers.CHANGE_LOGS_TARGETS.CATEGORY,
    action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.CATEGORY_UPDATE,
    description: `Category ${doc.nameAm} updated! ${docName[0]} changed from "${doc[docName[0]]}" to "${options[docName[0]]}".`
  });
  if(log){
    helpers.sendToTelegram(`Category <b>${doc.nameAm}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n${docName[0].toUpperCase()} changed from: <strike>${doc[docName[0]]}</strike> to: <i>${options[docName[0]]}</i>.`);
  }
  next();
});

const Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories;