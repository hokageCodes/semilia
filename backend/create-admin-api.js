const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createAdminViaDatabase = async () => {
  try {
    // Connect to MongoDB using the same connection string as the backend
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in .env file');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@semilia.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      
      // If the user exists but isn't admin, update them
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.emailVerified = true;
        await existingAdmin.save();
        console.log('✅ Updated user to admin role!');
      }
      
      process.exit(0);
    }

    // Create admin user using the User model (will hash password automatically)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@semilia.com',
      password: 'AdminPass123',
      role: 'admin',
      isActive: true,
      emailVerified: true, // Skip email verification for admin
      phone: '0000000000',
      address: {
        country: 'Nigeria'
      }
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

// Run the function
createAdminViaDatabase();

