// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  main: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  subcategories: [
    {
      name: { type: String, required: true },
      image: { type: String }, // optional
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
