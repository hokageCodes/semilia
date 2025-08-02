const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: String,

    category: {
      main: {
        type: String,
        enum: ['Women', 'Men'],
        required: true,
      },
      sub: {
        type: String,
        enum: ['Dresses', 'Adire Section', 'Tops', 'Pants'], // Top and pants for men
        required: true,
      },
    },

    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    mainImage: {
      type: String,
      default: '',
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String },
        rating: { type: Number, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
