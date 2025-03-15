import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { uploadImage } from '../../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ArticleForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false 
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialData.featuredImage || '');

  const { 
    register, 
    handleSubmit, 
    control, 
    setValue, 
    formState: { errors }, 
    watch 
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      slug: initialData.slug || '',
      content: initialData.content || '',
      excerpt: initialData.excerpt || '',
      featuredImage: initialData.featuredImage || '',
      category: initialData.category?._id || '',
      status: initialData.status || 'draft',
      metaTitle: initialData.meta?.title || '',
      metaDescription: initialData.meta?.description || '',
      metaKeywords: initialData.meta?.keywords || ''
    }
  });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Auto-generate slug from title if no slug exists
  const title = watch('title');
  useEffect(() => {
    if (title && !initialData.slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setValue('slug', generatedSlug);
    }
  }, [title, setValue, initialData.slug]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setImageUploading(true);
      const response = await uploadImage(formData);
      setValue('featuredImage', response.data.url);
      setPreviewImage(response.data.url);
      setImageUploading(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      setImageUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          id="title"
          type="text"
          className={`form-input ${errors.title ? 'border-red-500' : ''}`}
          {...register('title', { 
            required: 'Title is required' 
          })}
        />
        {errors.title && (
          <div className="error-text">{errors.title.message}</div>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="form-label">Slug *</label>
        <input
          id="slug"
          type="text"
          className={`form-input ${errors.slug ? 'border-red-500' : ''}`}
          {...register('slug', { 
            required: 'Slug is required',
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: 'Slug can only contain lowercase letters, numbers, and hyphens'
            }
          })}
        />
        {errors.slug && (
          <div className="error-text">{errors.slug.message}</div>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="form-label">Category *</label>
        <select
          id="category"
          className={`form-select ${errors.category ? 'border-red-500' : ''}`}
          {...register('category', { 
            required: 'Category is required' 
          })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
        {errors.category && (
          <div className="error-text">{errors.category.message}</div>
        )}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="form-label">Content *</label>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'Content is required' }}
          render={({ field }) => (
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
              className={`bg-white ${errors.content ? 'quill-error' : ''}`}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
          )}
        />
        {errors.content && (
          <div className="error-text mt-1">{errors.content.message}</div>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="form-label">Excerpt</label>
        <textarea
          id="excerpt"
          rows="3"
          className={`form-textarea ${errors.excerpt ? 'border-red-500' : ''}`}
          placeholder="Short summary of the article"
          {...register('excerpt')}
        ></textarea>
        {errors.excerpt && (
          <div className="error-text">{errors.excerpt.message}</div>
        )}
      </div>

      {/* Featured Image */}
      <div>
        <label htmlFor="featuredImage" className="form-label">Featured Image</label>
        <div className="mt-1 flex items-center">
          <input
            type="hidden"
            {...register('featuredImage')}
          />
          <label className="relative btn-secondary cursor-pointer">
            <CloudUploadIcon className="mr-2 h-5 w-5" />
            {imageUploading ? 'Uploading...' : 'Upload Image'}
            <input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          {imageUploading && (
            <CircularProgress size={24} className="ml-2" />
          )}
        </div>
        {previewImage && (
          <div className="mt-2">
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 w-auto object-cover rounded-md"
            />
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="form-label">Status</label>
        <div className="mt-1 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="draft"
              className="form-radio"
              {...register('status')}
            />
            <span className="ml-2">Draft</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="published"
              className="form-radio"
              {...register('status')}
            />
            <span className="ml-2">Published</span>
          </label>
        </div>
      </div>

      {/* SEO Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
        {/* Meta Title */}
        <div className="mb-4">
          <label htmlFor="metaTitle" className="form-label">Meta Title</label>
          <input
            id="metaTitle"
            type="text"
            className="form-input"
            {...register('metaTitle')}
          />
        </div>
        
        {/* Meta Description */}
        <div className="mb-4">
          <label htmlFor="metaDescription" className="form-label">Meta Description</label>
          <textarea
            id="metaDescription"
            rows="2"
            className="form-textarea"
            {...register('metaDescription')}
          ></textarea>
        </div>
        
        {/* Meta Keywords */}
        <div>
          <label htmlFor="metaKeywords" className="form-label">Meta Keywords</label>
          <input
            id="metaKeywords"
            type="text"
            className="form-input"
            placeholder="Comma separated keywords"
            {...register('metaKeywords')}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Article'
          )}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;
