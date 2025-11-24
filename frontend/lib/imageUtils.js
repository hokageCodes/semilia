// Helper function to get valid image URL for products
export const getProductImageUrl = (product, imageIndex = 0) => {
  const placeholderPatterns = [
    '/placeholder.jpg',
    'placeholder.jpg',
    'via.placeholder.com',
    'placeholder'
  ];
  
  // Check mainImage
  if (product?.mainImage && product.mainImage.trim()) {
    const isPlaceholder = placeholderPatterns.some(pattern => 
      product.mainImage.toLowerCase().includes(pattern.toLowerCase())
    );
    if (!isPlaceholder) {
      return product.mainImage;
    }
  }
  
  // Check images array
  if (product?.images?.[imageIndex]?.url && product.images[imageIndex].url.trim()) {
    const isPlaceholder = placeholderPatterns.some(pattern => 
      product.images[imageIndex].url.toLowerCase().includes(pattern.toLowerCase())
    );
    if (!isPlaceholder) {
      return product.images[imageIndex].url;
    }
  }
  
  return null;
};

// Helper function to get valid image URL for categories
export const getCategoryImageUrl = (category) => {
  if (category?.image && category.image.trim()) {
    return category.image;
  }
  return null;
};

// Helper function to validate image URL
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.trim().length > 0;
};

// Helper function to get fallback image
export const getFallbackImage = (type = 'product') => {
  const fallbackImages = {
    product: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
    category: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&crop=center',
    user: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  };
  return fallbackImages[type] || fallbackImages.product;
};