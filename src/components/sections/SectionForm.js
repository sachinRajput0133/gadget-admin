import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SectionForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false 
}) => {
  const { articles } = useSelector((state) => state.articles);
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      order: initialData.order || 0,
      isActive: initialData.isActive ?? true,
      articles: initialData.articles?.map(article => article._id) || []
    }
  });

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

      {/* Description */}
      <div>
        <label htmlFor="description" className="form-label">Description *</label>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
              className={`bg-white ${errors.description ? 'quill-error' : ''}`}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  ['link'],
                  ['clean']
                ],
              }}
            />
          )}
        />
        {errors.description && (
          <div className="error-text mt-1">{errors.description.message}</div>
        )}
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order" className="form-label">Display Order</label>
        <input
          id="order"
          type="number"
          className="form-input w-24"
          {...register('order', { 
            valueAsNumber: true 
          })}
        />
        <p className="text-sm text-gray-500 mt-1">
          Controls the display order of sections on the frontend. Lower numbers are displayed first.
        </p>
      </div>

      {/* Is Active */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary-600"
            {...register('isActive')}
          />
          <span className="ml-2 text-gray-700">Active</span>
        </label>
        <p className="text-sm text-gray-500 mt-1">
          If unchecked, this section will not be displayed on the frontend.
        </p>
      </div>

      {/* Associated Articles */}
      <div>
        <label className="form-label">Associated Articles</label>
        <p className="text-sm text-gray-500 mb-2">
          Articles associated with this section can be managed on the section detail page after creation.
        </p>
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
            'Save Section'
          )}
        </button>
      </div>
    </form>
  );
};

export default SectionForm;
