const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const updateAdminPassword = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find and update admin user
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    if (adminUser) {
      const hashedPassword = await bcrypt.hash('AdminPass123', 12);
      adminUser.password = hashedPassword;
      adminUser.emailVerified = true;
      await adminUser.save();
      console.log('✅ Admin password updated:', adminUser.email);
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

updateAdminPassword();
