const mongoose = require('mongoose');
const Category = require('./src/models/Category');
require('dotenv').config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Drop existing categories collection to remove old indexes
    await Category.collection.drop().catch(() => console.log('Collection does not exist yet'));
    console.log('🗑️  Dropped existing categories');

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

    for (const categoryData of categories) {
      const category = await Category.create(categoryData);
      console.log(`✅ Category created: ${category.main} with ${category.subcategories.length} subcategories`);
    }

    console.log('\n🎉 Categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seedCategories();

