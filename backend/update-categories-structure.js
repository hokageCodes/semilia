const mongoose = require('mongoose');
const Category = require('./src/models/Category');
require('dotenv').config();

const updateCategoriesStructure = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    // Create new category structure
    const newCategories = [
      {
        main: 'Men',
        image: 'https://images.unsplash.com/photo-1611312449297-a69dc9c3987b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZhc2hpb24lMjBtZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        subcategories: [
          { name: 'Adire Pants - Type 1', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
          { name: 'Adire Pants - Type 2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
          { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
          { name: 'Trousers', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
          { name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
        ]
      },
      {
        main: 'Women',
        image: 'https://plus.unsplash.com/premium_photo-1687188210526-50610de047d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbiUyMHRvcHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        subcategories: [
          { name: 'Pants', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400' },
          { name: 'Co-ord Set', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400' },
          { name: 'Tops', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400' },
          { name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
        ]
      },
      {
        main: 'Dresses',
        image: '/assets/Bloom.jpg',
        subcategories: [
          { name: 'Adire Dresses', image: '/assets/adire.jpg' },
          { name: 'Casual Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
          { name: 'Formal Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
          { name: 'Evening Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
          { name: 'Maxi Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' }
        ]
      },
      {
        main: 'Adire',
        image: '/assets/adire.jpg',
        subcategories: [
          { name: 'Adire Dresses', image: '/assets/adire.jpg' },
          { name: 'Adire Pants - Type 1', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
          { name: 'Adire Pants - Type 2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
          { name: 'Adire Tops', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
          { name: 'Adire Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
        ]
      }
    ];

    // Insert new categories
    const createdCategories = await Category.insertMany(newCategories);
    console.log(`✅ Created ${createdCategories.length} categories with subcategories`);

    // Display the structure
    console.log('\n📋 New Category Structure:');
    createdCategories.forEach(category => {
      console.log(`\n${category.main}:`);
      category.subcategories.forEach(sub => {
        console.log(`  - ${sub.name}`);
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

updateCategoriesStructure();
