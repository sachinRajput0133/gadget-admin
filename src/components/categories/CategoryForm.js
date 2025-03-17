import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/slices/categoriesSlice';

const CategoryForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false 
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    watch 
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      slug: initialData.slug || '',
      description: initialData.description || '',
      parent: initialData.parent?._id || '',
      metaTitle: initialData.meta?.title || '',
      metaDescription: initialData.meta?.description || '',
      metaKeywords: initialData.meta?.keywords || ''
    }
  });

  // Fetch all categories for parent selection
  useEffect(() => {
    dispatch(fetchCategories({ limit: 100 }));
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

      {/* Description */}
      <div>
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          rows="3"
          className={`form-textarea ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Category description"
          {...register('description')}
        ></textarea>
        {errors.description && (
          <div className="error-text">{errors.description.message}</div>
        )}
      </div>

      {/* Parent Category */}
      <div>
        <label htmlFor="parent" className="form-label">Parent Category</label>
        <select
          id="parent"
          className="form-select"
          {...register('parent')}
        >
          <option value="">None (Top Level Category)</option>
          {categories
            .filter(category => category._id !== initialData._id) // Filter out current category
            .map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Optional. Select a parent category to create a hierarchy.
        </p>
      </div>

      {/* SEO Section */}
      {/* <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
        <div className="mb-4">
          <label htmlFor="metaTitle" className="form-label">Meta Title</label>
          <input
            id="metaTitle"
            type="text"
            className="form-input"
            {...register('metaTitle')}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="metaDescription" className="form-label">Meta Description</label>
          <textarea
            id="metaDescription"
            rows="2"
            className="form-textarea"
            {...register('metaDescription')}
          ></textarea>
        </div>
        
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
      </div> */}

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
            'Save Category'
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
