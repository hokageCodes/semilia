const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

// Email of the user you want to make admin
const USER_EMAIL = 'ogundebusayo16@gmail.com';

const makeUserAdmin = async () => {
  try {
    // Connect to MongoDB using the same connection string as the backend
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in .env file');
      console.log('💡 Make sure your backend/.env file has MONGO_URI set');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.log(`❌ User with email ${USER_EMAIL} not found!`);
      console.log('💡 Please make sure this email is registered first');
      process.exit(1);
    }

    console.log('📧 Found user:', {
      name: user.name,
      email: user.email,
      currentRole: user.role,
      emailVerified: user.emailVerified,
      isActive: user.isActive
    });

    // Update user to admin and verify email
    user.role = 'admin';
    user.emailVerified = true;
    user.isActive = true;
    user.emailVerificationToken = undefined; // Clear verification token
    await user.save();

    console.log('');
    console.log('🎉 SUCCESS! User updated:');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('✅ Email Verified:', user.emailVerified);
    console.log('🆔 ID:', user._id);
    console.log('');
    console.log('🔐 You can now login at:');
    console.log('   🌐 Admin Login: http://localhost:3000/admin-login');
    console.log('   📧 Email:', user.email);
    console.log('   🔒 Password: [your existing password]');
    console.log('');
    console.log('📊 Admin Dashboard: http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the function
makeUserAdmin();

