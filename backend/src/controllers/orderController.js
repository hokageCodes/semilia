const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create a new order
// @route POST /api/orders
// @access Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, paymentMethod, taxPrice = 0, shippingPrice = 0 } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    let itemsTotal = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      itemsTotal += product.price * item.qty;
    }

    const totalPrice = itemsTotal + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingInfo,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty },
      });
    }

    // Optionally clear cart
    // await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (err) {
    console.error('[Create Order Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc Get logged-in user's orders
// @route GET /api/orders/my
// @access Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      'orderItems.product',
      'name price images'
    );
    res.json(orders);
  } catch (err) {
    console.error('[Get My Orders Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc Mark order as paid
// @route PUT /api/orders/:id/pay
// @access Private
exports.markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('[Mark Order As Paid Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc Get all orders (admin)
// @route GET /api/orders
// @access Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price images');
    res.json(orders);
  } catch (err) {
    console.error('[Get All Orders Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc Delete an order (admin)
// @route DELETE /api/orders/:id
// @access Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.remove();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('[Delete Order Error]', err);
    res.status(500).json({
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};
