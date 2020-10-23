const mongoose = require('mongoose');
const helpers = require('../helpers');
const ActivityLogs = require('./ActivityLogs');
const ChangeLogs = require('./ChangeLogs');

const productsSchema = new mongoose.Schema({
  nameAm: {
    type: String,
    unique: true
  },
  nameEn: String,
  nameRu: String,
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  unit: { type: String, enum: helpers.UNIT_TYPES },
  maxOrder: { type: Number, default: 20 },
  minOrder: { type: Number, default: 0.5 },
  category: { type: mongoose.Schema.ObjectId, ref: 'Categories' },
  photo: String,
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date(Date.now() + 14400000)},
  updated_at: Date,
  featured: { type: Boolean, default: false },

  keywords: String,
  descriptionAm: String,
  descriptionRu: String,
  descriptionEn: String,
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// QUERY MIDDLEWARE
productsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: '-__v'
  });
  next();
});

productsSchema.pre(/^save/, async function(next) {
  await ActivityLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    type: helpers.ACTIVITY_LOGS_STATUS_TYPES.PRODUCT_CREATE,
    description: `Product "${this.nameAm}" created!`
  });
  helpers.sendToTelegram(`Product "${this.nameAm}" created! 😍`);
  next();
});

productsSchema.pre(/^findOneAndUpdate/, async function(next) {
  const doc = await this.model.findOne(this.getQuery());
  const options = await this.getUpdate();
  const docName = Object.keys(options);
  const log = await ChangeLogs.create({
    admin: "5f8a0a8cb68b0e012ce2c846",
    target_model: helpers.CHANGE_LOGS_TARGETS.PRODUCT,
    action_type: helpers.ACTIVITY_LOGS_STATUS_TYPES.PRODUCT_UPDATE,
    description: `Product ${doc.nameAm} updated! ${docName[0]} changed from "${doc[docName[0]]}" to "${options[docName[0]]}".`
  });
  if(log){
    helpers.sendToTelegram(`Product <b>${doc.nameAm}</b> updated!\n\n🍐🍊🍋🍓🥝🥬🥕🥥🍇🍍\n\n${docName[0].toUpperCase()} changed from: <strike>${doc[docName[0]]}</strike> to: <i>${options[docName[0]]}</i>.`);
  }
  next();
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;