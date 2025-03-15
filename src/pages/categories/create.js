import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createCategory } from '../../store/slices/categoriesSlice';
import CategoryForm from '../../components/categories/CategoryForm';
import { toast } from 'react-toastify';

const CreateCategory = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { createUpdateLoading, createUpdateError } = useSelector((state) => state.categories);

  // Show error toast if creation fails
  React.useEffect(() => {
    if (createUpdateError) {
      toast.error(createUpdateError);
    }
  }, [createUpdateError]);

  const handleSubmit = async (data) => {
    try {
      // Format data for the API
      const categoryData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        parent: data.parent || null,
        meta: {
          title: data.metaTitle,
          description: data.metaDescription,
          keywords: data.metaKeywords
        }
      };

      // Dispatch create category action
      await dispatch(createCategory(categoryData)).unwrap();
      toast.success('Category created successfully');
      router.push('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Create Category</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <CategoryForm 
          onSubmit={handleSubmit} 
          loading={createUpdateLoading} 
        />
      </div>
    </div>
  );
};

export default CreateCategory;
