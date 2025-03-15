import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createSection } from '../../store/slices/sectionsSlice';
import SectionForm from '../../components/sections/SectionForm';
import { toast } from 'react-toastify';

const CreateSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { createUpdateLoading, createUpdateError } = useSelector((state) => state.sections);

  // Show error toast if creation fails
  React.useEffect(() => {
    if (createUpdateError) {
      toast.error(createUpdateError);
    }
  }, [createUpdateError]);

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

      // Dispatch create section action
      await dispatch(createSection(sectionData)).unwrap();
      toast.success('Section created successfully');
      router.push('/sections');
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Create Section</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <SectionForm 
          onSubmit={handleSubmit} 
          loading={createUpdateLoading} 
        />
      </div>
    </div>
  );
};

export default CreateSection;
