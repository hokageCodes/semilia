const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const fixProductImages = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    for (const product of products) {
      let updated = false;

      // Fix mainImage if it's a placeholder
      if (!product.mainImage || product.mainImage.includes('placeholder')) {
        product.mainImage = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800';
        updated = true;
      }

      // Fix images array
      if (product.images && product.images.length > 0) {
        product.images = product.images.map((img, index) => {
          if (typeof img === 'string' && img.includes('placeholder')) {
            return {
              url: `https://images.unsplash.com/photo-${1445205170230 + index}-053b83016050?w=800`,
              public_id: `fixed_${Date.now()}_${index}`
            };
          } else if (img.url && img.url.includes('placeholder')) {
            return {
              url: `https://images.unsplash.com/photo-${1445205170230 + index}-053b83016050?w=800`,
              public_id: img.public_id || `fixed_${Date.now()}_${index}`
            };
          }
          return img;
        });
        updated = true;
      } else {
        // Add default images if none exist
        product.images = [
          { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', public_id: 'default_1' },
          { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', public_id: 'default_2' }
        ];
        updated = true;
      }

      // Make sure slug exists
      if (!product.slug && product.name) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        updated = true;
      }

      if (updated) {
        await product.save();
        console.log(`✅ Fixed: ${product.name}`);
        console.log(`   - Slug: ${product.slug}`);
        console.log(`   - Main Image: ${product.mainImage}`);
        console.log(`   - Images: ${product.images.length} images`);
      } else {
        console.log(`⏭️  Skipped: ${product.name} (already has valid images)`);
      }
    }

    console.log('\n🎉 All products updated!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

fixProductImages();

