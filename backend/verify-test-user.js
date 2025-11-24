const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const verifyTestUser = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find and verify the test user
    const user = await User.findOne({ email: 'testuser@example.com' });
    if (user) {
      user.emailVerified = true;
      await user.save();
      console.log('✅ Test user email verified:', user.email);
    } else {
      console.log('❌ Test user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

verifyTestUser();
