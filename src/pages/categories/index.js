import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchCategories, deleteCategory } from '../../store/slices/categoriesSlice';
import { toast } from 'react-toastify';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

// Components
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomLink from '../../widget/customLink';

const Categories = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories, pagination, loading, error } = useSelector((state) => state.categories);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, slug: null });
  
  // Get query params
  const { page = 1, limit = 10, search = '' } = router.query;

  // Fetch categories on page load or query change
  useEffect(() => {
    dispatch(fetchCategories({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update the query params
    const query = { ...router.query, search: searchTerm, page: 1 };
    
    // Remove empty params
    Object.keys(query).forEach(key => 
      !query[key] && delete query[key]
    );
    
    router.push({
      pathname: router.pathname,
      query
    });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirmDelete.slug) return;
    
    try {
      await dispatch(deleteCategory(confirmDelete.slug)).unwrap();
      toast.success('Category deleted successfully');
      setConfirmDelete({ open: false, slug: null });
    } catch (error) {
      toast.error(error);
      setConfirmDelete({ open: false, slug: null });
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <CustomLink href="/categories/create">
          <AddIcon className="mr-1 h-5 w-5" />
          Create Category
        </CustomLink>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="form-input pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="loader"></div>
                    </div>
                  </td>
                </tr>
              ) : categories?.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.parent ? category.parent.title : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <CustomLink href={`/categories/edit/${category.slug}`}>
                          Edit
                            <EditIcon className="h-5 w-5" />
                        </CustomLink>
                        <button
                          onClick={() => setConfirmDelete({ open: true, slug: category.slug })}
                          className="icon-button text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <DeleteIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      {confirmDelete.open && (
        <ConfirmDialog
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone and may affect associated articles."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete({ open: false, slug: null })}
        />
      )}
    </div>
  );
};

export default Categories;
