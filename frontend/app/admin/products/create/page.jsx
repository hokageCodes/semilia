'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { adminAPI, categoriesAPI } from '@/lib/api';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Validation Schema - Updated to match backend expectations
const productSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required').min(3, 'Name must be at least 3 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
  originalPrice: Yup.number().min(0, 'Original price must be positive'),
  categoryMain: Yup.string().required('Category is required'),
  categorySub: Yup.string().required('Subcategory is required'),
  brand: Yup.string(),
  countInStock: Yup.number().required('Stock is required').min(0, 'Stock must be positive'),
  lowStockThreshold: Yup.number().min(0, 'Threshold must be positive'),
  sizes: Yup.array().of(Yup.string()),
  colors: Yup.array().of(Yup.string()),
  tags: Yup.array().of(Yup.string()),
});

export default function CreateProductPage() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getCategories,
  });

  const categories = categoriesData || [];

  // Debug: Log available categories on load
  console.log('📦 Available Categories:', categories.map(c => ({ id: c._id, main: c.main, subcategories: c.subcategories?.map(s => s.name) })));
  console.log('📦 Categories Data:', categories);
  console.log('📦 Categories Length:', categories.length);

  // Create product mutation with improved error handling
  const createProductMutation = useMutation({
    mutationFn: async (formData) => {
      // Use the API function instead of direct fetch
      const response = await adminAPI.createProduct(formData);
      return response;
    },
    onSuccess: () => {
      toast.success('Product created successfully!');
      router.push('/admin/products');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(error.message || 'Failed to create product');
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImageFiles([...imageFiles, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the preview URL
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      
      // Basic fields - MUST match backend expectations
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      
      // Optional originalPrice
      if (values.originalPrice) {
        formData.append('originalPrice', values.originalPrice);
      }
      
      // Validate category values before sending
      console.log('🔍 Form Values:', {
        categoryMain: values.categoryMain,
        categorySub: values.categorySub,
        selectedCategoryObj: values.selectedCategoryObj
      });
      
      // Validate main category - must be one of the valid enum values
      const validMainCategories = ['Women', 'Men', 'Accessories', 'Kids'];
      
      if (!values.categoryMain || !validMainCategories.includes(values.categoryMain)) {
        const errorMsg = `Invalid category! Selected: "${values.categoryMain}"\n\nPlease select:\n✅ Women\n✅ Men\n✅ Accessories\n✅ Kids\n\nNOT subcategories like "Dresses", "Tops", etc.`;
        toast.error(errorMsg);
        console.error('❌ Invalid category selected:', values.categoryMain);
        console.error('✅ Valid options:', validMainCategories);
        setSubmitting(false);
        return;
      }
      
      if (!values.categorySub) {
        toast.error('Please select a subcategory');
        setSubmitting(false);
        return;
      }
      
      // Ensure we're sending the correct structure
      const categoryData = JSON.stringify({
        main: values.categoryMain,
        sub: values.categorySub
      });
      
      console.log('✅ Valid Category Data:', categoryData);
      formData.append('category', categoryData);
      
      // Brand (optional)
      if (values.brand) {
        formData.append('brand', values.brand);
      }
      
      // Stock - backend expects 'countInStock'
      formData.append('countInStock', values.countInStock);
      
      // Optional fields
      if (values.lowStockThreshold) {
        formData.append('lowStockThreshold', values.lowStockThreshold);
      }
      
      if (values.status) {
        formData.append('status', values.status);
      }
      
      if (values.trackInventory !== undefined) {
        formData.append('trackInventory', values.trackInventory);
      }
      
      // isFeatured - convert to string for FormData
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false');
      
      // Handle variants (sizes/colors) as backend expects
      const variants = [];
      
      if (values.sizes && values.sizes.length > 0) {
        variants.push({
          name: 'Size',
          options: values.sizes,
          required: false
        });
      }
      
      if (values.colors && values.colors.length > 0) {
        variants.push({
          name: 'Color',
          options: values.colors,
          required: false
        });
      }
      
      if (variants.length > 0) {
        formData.append('variants', JSON.stringify(variants));
      }
      
      // Tags
      if (values.tags && values.tags.length > 0) {
        formData.append('tags', JSON.stringify(values.tags));
      }

      // Append images
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      // Debug logging
      console.log('=== FormData Contents ===');
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? pair[1] : pair[1]);
      }

      await createProductMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (categoriesLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-yellow border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Show error state
  if (categoriesError) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Categories</h1>
          <p className="text-gray-600 mb-4">{categoriesError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-yellow text-black rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-1">Add a new product to your store</p>
      </div>

      <Formik
        initialValues={{
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          categoryMain: '',
          categorySub: '',
          selectedCategoryObj: null,
          brand: '',
          countInStock: '',
          lowStockThreshold: 10,
          status: 'active',
          trackInventory: true,
          isFeatured: false,
          sizes: [],
          colors: [],
          tags: [],
        }}
        validationSchema={productSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Classic Cotton T-Shirt"
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your product..."
                  />
                  {errors.description && touched.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                                 {/* Category & Brand */}
{/* Category & Brand */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Main Category * 
                       <span className="text-xs text-gray-500 ml-2">(Women, Men, Accessories, Kids)</span>
                     </label>
                     <Field name="categoryMain">
                       {({ field, form }) => (
                         <select
                           {...field}
                           onChange={(e) => {
                             const mainCategory = e.target.value;
                            const selectedCategory = categories.find(c => c.main === mainCategory);
                            
                            console.log('📋 Selected Main Category:', mainCategory);
                            console.log('📋 Category Object:', selectedCategory);
                            console.log('📋 Available Categories:', categories.map(c => c.main));
                            
                            // Update the field value first
                            form.setFieldValue('categoryMain', mainCategory);
                            
                            // Double-check it's a valid main category
                            if (mainCategory && selectedCategory) {
                              // Set subcategory dropdown values
                              form.setFieldValue('categorySub', '');
                              form.setFieldValue('selectedCategoryObj', selectedCategory);
                              console.log('✅ Subcategories available:', selectedCategory.subcategories);
                            } else if (mainCategory) {
                              console.error('❌ Category not found:', mainCategory);
                              toast.error('Category not found. Please refresh the page.');
                            }
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                            errors.categoryMain && touched.categoryMain ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select main category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.main}>
                              {cat.main}
                            </option>
                          ))}
                        </select>
                       )}
                     </Field>
                     {errors.categoryMain && touched.categoryMain && (
                       <p className="text-red-500 text-sm mt-1">{errors.categoryMain}</p>
                     )}
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Subcategory *
                       <span className="text-xs text-gray-500 ml-2">(e.g., Dresses, Tops, etc.)</span>
                     </label>
                     <Field
                       as="select"
                       name="categorySub"
                       onChange={(e) => {
                         const subCategory = e.target.value;
                         console.log('📋 Selected Subcategory:', subCategory);
                         setFieldValue('categorySub', subCategory);
                       }}
                       className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                         errors.categorySub && touched.categorySub ? 'border-red-500' : 'border-gray-300'
                       }`}
                       disabled={!values.categoryMain}
                     >
                       <option value="">Select subcategory</option>
                       {values.selectedCategoryObj?.subcategories?.map((sub, index) => (
                         <option key={index} value={sub.name}>
                           {sub.name}
                         </option>
                       ))}
                     </Field>
                     {errors.categorySub && touched.categorySub && (
                       <p className="text-red-500 text-sm mt-1">{errors.categorySub}</p>
                     )}
                     {!values.categoryMain && (
                       <p className="text-gray-500 text-xs mt-1">Select a main category first</p>
                     )}
                   </div>
                 </div>

                {/* Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <Field
                      name="brand"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="e.g., Nike"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Field
                        type="checkbox"
                        name="isFeatured"
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <Field
                    name="price"
                    type="number"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      errors.price && touched.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && touched.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₦)
                    <span className="text-gray-500 text-xs ml-2">(for sale pricing)</span>
                  </label>
                  <Field
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Inventory</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <Field
                      name="countInStock"
                      type="number"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        errors.countInStock && touched.countInStock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.countInStock && touched.countInStock && (
                      <p className="text-red-500 text-sm mt-1">{errors.countInStock}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Stock Threshold
                    </label>
                    <Field
                      name="lowStockThreshold"
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="trackInventory"
                    className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Track inventory for this product
                  </label>
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
              
              <div className="space-y-4">
                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes
                  </label>
                  <FieldArray name="sizes">
                    {({ push, remove }) => (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {values.sizes.map((size, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                            >
                              <span className="text-sm">{size}</span>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
                                if (!values.sizes.includes(size)) {
                                  push(size);
                                }
                              }}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </label>
                  <FieldArray name="colors">
                    {({ push, remove }) => (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {values.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                            >
                              <span className="text-sm">{color}</span>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Gray', 'Brown'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                if (!values.colors.includes(color)) {
                                  push(color);
                                }
                              }}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <FieldArray name="tags">
                    {({ push, remove }) => (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {values.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                            >
                              <span className="text-sm">{tag}</span>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a tag"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value && !values.tags.includes(value)) {
                                  push(value);
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              
              <div className="space-y-4">
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imageFiles.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP (max 5 images)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Product Status</h2>
              
              <Field
                as="select"
                name="status"
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </Field>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 md:flex-none px-8 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 md:flex-none px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}