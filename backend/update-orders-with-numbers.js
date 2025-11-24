const mongoose = require('mongoose');
const Order = require('./src/models/Order');
require('dotenv').config();

const updateOrdersWithNumbers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find orders without order numbers
    const ordersWithoutNumbers = await Order.find({ orderNumber: { $exists: false } });
    console.log(`📦 Found ${ordersWithoutNumbers.length} orders without order numbers`);

    // Update each order with a unique order number
    for (const order of ordersWithoutNumbers) {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const orderNumber = `ORD-${year}-${randomNum}`;
      
      // Check if this order number already exists
      const existingOrder = await Order.findOne({ orderNumber });
      if (existingOrder) {
        // If it exists, generate a new one
        const newRandomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        order.orderNumber = `ORD-${year}-${newRandomNum}`;
      } else {
        order.orderNumber = orderNumber;
      }
      
      await order.save();
      console.log(`✅ Updated order ${order._id} with order number: ${order.orderNumber}`);
    }

    console.log('🎉 All orders updated with order numbers!');

  } catch (error) {
    console.error('❌ Error updating orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
};

updateOrdersWithNumbers();
