const mongoose = require('mongoose');
const helpers = require('../helpers');

const productsSchema = new mongoose.Schema({
  nameAm: {
    type: String,
    unique: true,
    required: [true, "Product must have an name."]
  },
  nameEn: String,
  nameRu: String,
  price: { type: Number, default: 0, required: [true, "Product must have a price."] },
  discount: { type: Number, default: 0 },
  unit: { 
    type: String,
    enum: {
        values: helpers.UNIT_TYPES,
        message: 'Unit is either: "10-11am", "13-14pm", "16-17pm", "19-20pm"'
    }
  },
  maxOrder: { type: Number, default: 20 },
  minOrder: { type: Number, default: 0.5 },
  category: { type: mongoose.Schema.ObjectId, ref: 'Categories' },
  photo: String,
  rate: {
    type: Number,
    default: 4.5
  },
  orderCount: {
    type: Number,
    default: 0
  },
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

productsSchema.virtual('change_logs', {
  ref: "ChangeLogs",
  foreignField: "product",
  localField: "_id"
});

// QUERY MIDDLEWARE
productsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: '-__v'
  })
  .populate({
    path: "change_logs",
    select: 'description created_at'
  });
  next();
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;