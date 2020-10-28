const mongoose = require('mongoose');

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
  productsCount: { type: Number, default: 0},

  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
  updated_at: Date,
});

const Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories;