import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import FormDrawer from '../common/Drawer/FormDrawer';
import { createSection, updateSection } from '../../store/slices/sectionsSlice';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-52 w-full bg-gray-100 animate-pulse rounded"></div>,
});

const SectionFormDrawer = ({ 
  open, 
  onClose, 
  sectionToEdit = null, 
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.sections);
  
  // Set up react-hook-form with native validation
  const { 
    register, 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors, isValid } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      order: 0,
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    }
  });
  
  const [submitting, setSubmitting] = useState(false);

  // Reset form with section data when editing
  useEffect(() => {
    if (sectionToEdit) {
      reset({
        title: sectionToEdit.title || '',
        description: sectionToEdit.description || '',
        slug: sectionToEdit.slug || '',
        order: sectionToEdit.order || 0,
        isActive: sectionToEdit.isActive !== undefined ? sectionToEdit.isActive : true,
        metaTitle: sectionToEdit.metaTitle || '',
        metaDescription: sectionToEdit.metaDescription || ''
      });
    } else {
      reset({
        title: '',
        description: '',
        slug: '',
        order: 0,
        isActive: true,
        metaTitle: '',
        metaDescription: ''
      });
    }
  }, [sectionToEdit, reset]);
  
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (sectionToEdit) {
        // Update existing section
        const resultAction = await dispatch(updateSection({ 
          id: sectionToEdit._id, 
          sectionData: data 
        }));
        
        if (updateSection.fulfilled.match(resultAction)) {
          toast.success('Section updated successfully');
          if (onSuccess) onSuccess(resultAction.payload);
          onClose();
        } else {
          toast.error(resultAction.payload || 'Failed to update section');
        }
      } else {
        // Create new section
        const resultAction = await dispatch(createSection(data));
        
        if (createSection.fulfilled.match(resultAction)) {
          toast.success('Section created successfully');
          if (onSuccess) onSuccess(resultAction.payload);
          onClose();
        } else {
          toast.error(resultAction.payload || 'Failed to create section');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      title={sectionToEdit ? 'Edit Section' : 'Create Section'}
      width={600}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.title ? 'border-red-500' : ''
            }`}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            {...register('slug')}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to auto-generate from title. Use only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value || ''}
                onChange={field.onChange}
                className={`bg-white ${errors.description ? 'border-red-500' : ''}`}
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
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            id="order"
            type="number"
            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            {...register('order', { valueAsNumber: true })}
          />
          <p className="mt-1 text-xs text-gray-500">
            Controls the display order of sections. Lower numbers are displayed first.
          </p>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="isActive"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('isActive')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="isActive" className="font-medium text-gray-700">Active</label>
            <p className="text-gray-500">If unchecked, this section will not be displayed on the frontend.</p>
          </div>
        </div>

        {/* <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">SEO Settings</h3>
          
          <div className="mb-4">
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              id="metaTitle"
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...register('metaTitle')}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to use the section title.
            </p>
          </div>
          
          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...register('metaDescription', { maxLength: 250 })}
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum 250 characters. Good for SEO.
            </p>
          </div>
        </div> */}

        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting || loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {sectionToEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              sectionToEdit ? 'Update Section' : 'Create Section'
            )}
          </button>
        </div>
      </form>
    </FormDrawer>
  );
};

export default SectionFormDrawer;