const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc Add item to cart
// @route POST /api/cart
// @access Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('[Add To Cart Error]', error);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc Get user's cart
// @route GET /api/cart
// @access Private
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('[Get User Cart Error]', error);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('[Remove From Cart Error]', error);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};

// @desc Get total cart price
// @route GET /api/cart/total
// @access Private
exports.getCartTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) return res.json({ totalPrice: 0 });

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({ totalPrice: total });
  } catch (error) {
    console.error('[Get Cart Total Error]', error);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};
