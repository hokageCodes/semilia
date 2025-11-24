const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/semilia');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@semilia.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: 'ogundebusayo16@gmail.com',
      password: 'AdminPass123',
      role: 'admin',
      isActive: true
    };

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create user (email verified automatically for admins)
    const admin = await User.create({
      ...adminData,
      password: hashedPassword,
      emailVerified: true // Admins don't need email verification
    });

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('🆔 ID:', admin._id);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('   Email: admin@semilia.com');
    console.log('   Password: AdminPass123');
    console.log('');
    console.log('🌐 Admin Login URL: http://localhost:3000/admin-login');
    console.log('📊 Admin Dashboard: http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.log('⚠️  Admin user already exists with this email!');
    }
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
createAdminUser();
