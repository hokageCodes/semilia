const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@semilia.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      return existingAdmin;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('AdminPass123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@semilia.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    return admin;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

const createSampleUsers = async () => {
  try {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('UserPass123', 12),
        role: 'user',
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('UserPass123', 12),
        role: 'user',
        isActive: true
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ User created: ${user.name} (${user.email})`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
        createdUsers.push(existingUser);
      }
    }

    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating sample users:', error.message);
    throw error;
  }
};

const createCategories = async () => {
  try {
    // First, clean up any incorrect categories that were created as main categories
    console.log('\n🧹 Cleaning up incorrect categories...');
    const deleted = await Category.deleteMany({ 
      main: { $in: ['Dresses', 'Adire'] } 
    });
    if (deleted.deletedCount > 0) {
      console.log(`✅ Deleted ${deleted.deletedCount} incorrect category/categories`);
    }

    const categories = [
      {
        main: 'Women',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
        subcategories: [
          { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
          { name: 'Tops', image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400' },
          { name: 'Adire', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400' },
        ]
      },
      {
        main: 'Men',
        image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800',
        subcategories: [
          { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
          { name: 'Pants', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400' },
          { name: 'Suits', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400' },
        ]
      },
      {
        main: 'Accessories',
        image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800',
        subcategories: [
          { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
          { name: 'Shoes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
          { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' },
        ]
      },
      {
        main: 'Kids',
        image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800',
        subcategories: [
          { name: 'Boys', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400' },
          { name: 'Girls', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400' },
        ]
      }
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ main: categoryData.main });
      if (!existingCategory) {
        const category = await Category.create(categoryData);
        createdCategories.push(category);
        console.log(`✅ Category created: ${category.main} with ${category.subcategories.length} subcategories`);
      } else {
        console.log(`⚠️  Category already exists: ${categoryData.main}`);
        createdCategories.push(existingCategory);
      }
    }

    return createdCategories;
  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
    throw error;
  }
};

const createSampleProducts = async (categories) => {
  try {
    const products = [
      {
        name: 'Elegant Black Dress',
        description: 'A stunning black dress perfect for formal occasions. Made with high-quality fabric and elegant design.',
        brand: 'Semilia',
        category: {
          main: 'Women',
          sub: 'Dresses'
        },
        price: 25000,
        countInStock: 15,
        rating: 4.5,
        numReviews: 12,
        isFeatured: true,
        mainImage: '',
        images: []
      },
      {
        name: 'Classic White Blouse',
        description: 'A timeless white blouse that pairs perfectly with any outfit. Professional and stylish.',
        brand: 'Semilia',
        category: {
          main: 'Women',
          sub: 'Tops'
        },
        price: 15000,
        countInStock: 25,
        rating: 4.2,
        numReviews: 8,
        isFeatured: true,
        mainImage: '',
        images: []
      },
      {
        name: 'Traditional Adire Gown',
        description: 'Beautiful traditional Nigerian Adire gown with intricate patterns and vibrant colors.',
        brand: 'Semilia',
        category: {
          main: 'Women',
          sub: 'Adire Section'
        },
        price: 35000,
        countInStock: 8,
        rating: 4.8,
        numReviews: 15,
        isFeatured: true,
        mainImage: '',
        images: []
      },
      {
        name: 'Men\'s Formal Pants',
        description: 'Comfortable and stylish formal pants for men. Perfect for business and casual wear.',
        brand: 'Semilia',
        category: {
          main: 'Men',
          sub: 'Pants'
        },
        price: 20000,
        countInStock: 20,
        rating: 4.3,
        numReviews: 6,
        isFeatured: false,
        mainImage: '',
        images: []
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = await Product.create(productData);
        createdProducts.push(product);
        console.log(`✅ Product created: ${product.name} - ₦${product.price.toLocaleString()}`);
      } else {
        console.log(`⚠️  Product already exists: ${productData.name}`);
        createdProducts.push(existingProduct);
      }
    }

    return createdProducts;
  } catch (error) {
    console.error('❌ Error creating sample products:', error.message);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/semilia');
    console.log('✅ Connected to MongoDB');
    console.log('🌱 Starting database seeding...\n');

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await createAdminUser();
    console.log('');

    // Create sample users
    console.log('👥 Creating sample users...');
    const users = await createSampleUsers();
    console.log('');

    // Create categories
    console.log('📂 Creating categories...');
    const categories = await createCategories();
    console.log('');

    // Create sample products
    console.log('🛍️  Creating sample products...');
    const products = await createSampleProducts(categories);
    console.log('');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('   Email: admin@semilia.com');
    console.log('   Password: AdminPass123');
    console.log('');
    console.log('👥 Sample User Credentials:');
    console.log('   Email: john@example.com | Password: UserPass123');
    console.log('   Email: jane@example.com | Password: UserPass123');
    console.log('');
    console.log('🌐 URLs:');
    console.log('   Admin Login: http://localhost:3000/admin-login');
    console.log('   Admin Dashboard: http://localhost:3000/admin/dashboard');
    console.log('   User Login: http://localhost:3000/login');
    console.log('   Shop: http://localhost:3000/shop');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();
