import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchCategoryBySlug, updateCategory, clearCategory } from '../../../store/slices/categoriesSlice';
import CategoryForm from '../../../components/categories/CategoryForm';
import { toast } from 'react-toastify';

const EditCategory = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const { category, loading, createUpdateLoading, error, createUpdateError } = useSelector(
    (state) => state.categories
  );

  // Fetch category on component mount
  useEffect(() => {
    if (slug) {
      dispatch(fetchCategoryBySlug(slug));
    }

    // Clean up category state on unmount
    return () => {
      dispatch(clearCategory());
    };
  }, [dispatch, slug]);

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

      // Dispatch update category action
      await dispatch(updateCategory({ slug, categoryData })).unwrap();
      toast.success('Category updated successfully');
      router.push('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Show loading state when fetching category
  if (loading && !category) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  // Show error message if category not found
  if (!loading && !category && !error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl text-red-600 mb-2">Category Not Found</h2>
        <p className="text-gray-600 mb-4">The category you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/categories')}
          className="btn-primary"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
      </div>

      {category && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CategoryForm 
            initialData={category}
            onSubmit={handleSubmit} 
            loading={createUpdateLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default EditCategory;
