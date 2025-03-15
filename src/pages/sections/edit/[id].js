import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchSectionById, updateSection, clearSection } from '../../../store/slices/sectionsSlice';
import SectionForm from '../../../components/sections/SectionForm';
import { toast } from 'react-toastify';

const EditSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { section, loading, createUpdateLoading, error, createUpdateError } = useSelector(
    (state) => state.sections
  );

  // Fetch section on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchSectionById(id));
    }

    // Clean up section state on unmount
    return () => {
      dispatch(clearSection());
    };
  }, [dispatch, id]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (createUpdateError) {
      toast.error(createUpdateError);
    }
  }, [error, createUpdateError]);

  const handleSubmit = async (data) => {
    try {
      // Format data for the API
      const sectionData = {
        title: data.title,
        description: data.description,
        order: data.order,
        isActive: data.isActive,
        articles: data.articles || []
      };

      // Dispatch update section action
      await dispatch(updateSection({ id, sectionData })).unwrap();
      toast.success('Section updated successfully');
      router.push('/sections');
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  // Show loading state when fetching section
  if (loading && !section) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  // Show error message if section not found
  if (!loading && !section && !error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl text-red-600 mb-2">Section Not Found</h2>
        <p className="text-gray-600 mb-4">The section you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/sections')}
          className="btn-primary"
        >
          Back to Sections
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Section</h1>
      </div>

      {section && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SectionForm 
            initialData={section}
            onSubmit={handleSubmit} 
            loading={createUpdateLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default EditSection;
