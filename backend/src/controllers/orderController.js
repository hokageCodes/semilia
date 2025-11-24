const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const {
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
  sendPaymentConfirmationEmail,
} = require('../services/emailService');

// @desc Create a new order (supports both authenticated and guest users)
// @route POST /api/orders
// @access Public (with optional auth)
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, paymentMethod, taxPrice = 0, shippingPrice = 0, guestEmail } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No order items provided' 
      });
    }

    // Validate shipping info
    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping information'
      });
    }

    // If user is authenticated, use their ID, otherwise it's a guest order
    const userId = req.user ? req.user._id : null;
    
    // For guest orders, require email
    if (!userId && !guestEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for guest checkout'
      });
    }

    let itemsTotal = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Product not found: ${item.name || 'Unknown'}` 
        });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({ 
          success: false,
          message: `Not enough stock for ${product.name}` 
        });
      }

      itemsTotal += product.price * item.qty;
      processedItems.push({
        name: product.name,
        qty: item.qty,
        image: product.mainImage,
        price: product.price,
        product: product._id
      });
    }

    const totalPrice = itemsTotal + shippingPrice + taxPrice;

    // Generate unique order number
    const generateOrderNumber = () => {
      const year = new Date().getFullYear();
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `ORD-${year}-${timestamp}${randomNum}`;
    };

    // Ensure unique order number
    let orderNumber = generateOrderNumber();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      const existingOrder = await Order.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      } else {
        orderNumber = generateOrderNumber();
        attempts++;
      }
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique order number. Please try again.'
      });
    }

    const orderData = {
      orderNumber, // Set orderNumber before creating
      orderItems: processedItems,
      shippingInfo: {
        ...shippingInfo,
        email: guestEmail || req.user?.email || shippingInfo.email
      },
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      source: 'website',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    // Add user reference if authenticated
    if (userId) {
      orderData.user = userId;
    }

    // Add guest email if not authenticated
    if (!userId && guestEmail) {
      orderData.guestEmail = guestEmail;
    }

    const order = await Order.create(orderData);

    // Decrement stock and increment purchase count
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          countInStock: -item.qty,
          purchaseCount: item.qty 
        }
      });
    }

    // Clear cart if user is authenticated
    if (userId) {
      await Cart.findOneAndDelete({ user: userId });
    }

    // Send emails (non-blocking)
    try {
      const customerEmail = order.shippingInfo.email || guestEmail || req.user?.email;
      const customerName = order.shippingInfo.fullName;
      
      // Send order confirmation to customer
      if (customerEmail) {
        sendOrderConfirmationEmail(
          customerEmail,
          customerName,
          order.orderNumber,
          order.totalPrice,
          order.paymentMethod
        ).catch(err => console.error('❌ Failed to send order confirmation email:', err));
      }

      // Send order notification to admin
      sendOrderNotificationToAdmin(
        order.orderNumber,
        customerName,
        customerEmail || 'N/A',
        order.totalPrice,
        order.paymentMethod,
        order._id.toString()
      ).catch(err => console.error('❌ Failed to send admin notification:', err));
    } catch (emailError) {
      console.error('❌ Email sending error (non-blocking):', emailError);
      // Don't fail the order creation if emails fail
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalPrice: order.totalPrice,
          orderItems: order.orderItems,
          shippingInfo: order.shippingInfo,
          createdAt: order.createdAt
        }
      }
    });
  } catch (err) {
    console.error('[Create Order Error]', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc Create a guest order (explicit endpoint)
// @route POST /api/orders/guest
// @access Public
exports.createGuestOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, paymentMethod, taxPrice = 0, shippingPrice = 0, guestEmail } = req.body;

    if (!guestEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for guest checkout'
      });
    }

    // Reuse the main createOrder logic
    req.body.guestEmail = guestEmail;
    req.user = null; // Ensure it's treated as guest
    
    return exports.createOrder(req, res);
  } catch (err) {
    console.error('[Create Guest Order Error]', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.'
    });
  }
};

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Public (for guest order tracking)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (err) {
    console.error('[Get Order By ID Error]', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.'
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

// @desc Confirm payment (Admin only - for bank transfers)
// @route PUT /api/orders/:id/confirm-payment
// @access Private/Admin
exports.confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if already paid
    if (order.isPaid && order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already confirmed for this order'
      });
    }

    // Update payment status
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = 'completed';
    order.paymentResult = {
      id: `admin-confirmed-${Date.now()}`,
      status: 'completed',
      update_time: new Date().toISOString(),
      email_address: order.shippingInfo.email || order.guestEmail,
      confirmedBy: req.user.name || req.user.email, // Admin who confirmed
    };

    // If order status is still pending, update to confirmed
    if (order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
    }

    const updatedOrder = await order.save();

    // Send payment confirmation email to customer (non-blocking)
    try {
      const customerEmail = order.shippingInfo.email || order.guestEmail;
      const customerName = order.shippingInfo.fullName;
      
      if (customerEmail) {
        sendPaymentConfirmationEmail(
          customerEmail,
          customerName,
          order.orderNumber,
          order.totalPrice
        ).catch(err => console.error('❌ Failed to send payment confirmation email:', err));
      }
    } catch (emailError) {
      console.error('❌ Email sending error (non-blocking):', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        order: updatedOrder
      }
    });
  } catch (err) {
    console.error('[Confirm Payment Error]', err);
    res.status(500).json({
      success: false,
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

    await order.deleteOne();
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

// @desc Track order by order number or ID (public)
// @route GET /api/orders/track/:orderNumber
// @access Public
exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required'
      });
    }

    // Try to find by orderNumber first, then by MongoDB _id
    let order = await Order.findOne({ orderNumber })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price images mainImage');

    // If not found by orderNumber, try by MongoDB _id
    if (!order && orderNumber.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderNumber)
        .populate('user', 'name email')
        .populate('orderItems.product', 'name price images mainImage');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your order number or ID.'
      });
    }

    // Return order details for tracking (without sensitive info)
    const orderDetails = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      orderItems: order.orderItems,
      shippingInfo: {
        fullName: order.shippingInfo.fullName,
        address: order.shippingInfo.address,
        city: order.shippingInfo.city,
        state: order.shippingInfo.state,
        country: order.shippingInfo.country,
        postalCode: order.shippingInfo.postalCode,
        phone: order.shippingInfo.phone
      },
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalPrice: order.totalPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      trackingNumber: order.trackingNumber,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    res.json({
      success: true,
      data: orderDetails
    });

  } catch (err) {
    console.error('[Track Order Error]', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc Update order status (admin)
// @route PATCH /api/orders/:id/status
// @access Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note, trackingNumber, estimatedDeliveryDate } = req.body;
    const orderId = req.params.id;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'Order status is required'
      });
    }

    const validStatuses = [
      'pending', 'confirmed', 'processing', 'quality_check', 'packaging',
      'ready_to_ship', 'shipped', 'in_transit', 'out_for_delivery',
      'delivered', 'cancelled', 'returned', 'refunded'
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status and related fields
    order.orderStatus = orderStatus;
    order.updatedBy = 'admin'; // Track who updated
    
    if (note) {
      order.adminNotes = note;
    }
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (estimatedDeliveryDate) {
      order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          statusHistory: order.statusHistory,
          trackingNumber: order.trackingNumber,
          estimatedDeliveryDate: order.estimatedDeliveryDate
        }
      }
    });

  } catch (err) {
    console.error('[Update Order Status Error]', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};
