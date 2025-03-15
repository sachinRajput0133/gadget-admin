import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchArticles, deleteArticle, toggleArticleStatus } from '../../store/slices/articlesSlice';
import { toast } from 'react-toastify';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';

// Components
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomLink from '../../widget/customLink';

const Articles = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { articles, pagination, loading, error } = useSelector((state) => state.articles);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  
  // Get query params
  const { page = 1, limit = 10, search = '', status = '' } = router.query;

  // Fetch articles on page load or query change
  useEffect(() => {
    dispatch(fetchArticles({ page, limit, search, status }));
  }, [dispatch, page, limit, search, status]);

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

  // Handle filter by status
  const handleFilterByStatus = (status) => {
    const query = { ...router.query, status, page: 1 };
    
    Object.keys(query).forEach(key => 
      !query[key] && delete query[key]
    );
    
    router.push({
      pathname: router.pathname,
      query
    });
  };

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await dispatch(toggleArticleStatus({ id, status: currentStatus === 'published' ? 'draft' : 'published' })).unwrap();
      toast.success(`Article ${currentStatus === 'published' ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      toast.error(error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    
    try {
      await dispatch(deleteArticle(confirmDelete.id)).unwrap();
      toast.success('Article deleted successfully');
      setConfirmDelete({ open: false, id: null });
    } catch (error) {
      toast.error(error);
      setConfirmDelete({ open: false, id: null });
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
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
        <CustomLink href="/articles/create">
          <span  className="btn-primary inline-flex items-center">
            <AddIcon className="mr-1 h-5 w-5" />
            Create Article
          </span>
        </CustomLink>
      </div>

      {/* Search and Filters */}
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
              placeholder="Search articles..."
              className="form-input pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFilterByStatus('')}
            className={`px-3 py-1 text-sm rounded-full ${
              !status ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterByStatus('published')}
            className={`px-3 py-1 text-sm rounded-full ${
              status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => handleFilterByStatus('draft')}
            className={`px-3 py-1 text-sm rounded-full ${
              status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="loader"></div>
                    </div>
                  </td>
                </tr>
              ) : articles?.length > 0 ? (
                articles.map((article) => (
                  <tr key={article._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.category ? article.category.title : 'No Category'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(article._id, article.status)}
                          className={`icon-button ${
                            article.status === 'published' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {article.status === 'published' ? (
                            <VisibilityOffIcon className="h-5 w-5" />
                          ) : (
                            <VisibilityIcon className="h-5 w-5" />
                          )}
                        </button>
                        <CustomLink href={`/articles/edit/${article._id}`}>
                          <span
                            className="icon-button text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <EditIcon className="h-5 w-5" />
                          </span>
                        </CustomLink>
                        <button
                          onClick={() => setConfirmDelete({ open: true, id: article._id })}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No articles found
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
          title="Delete Article"
          message="Are you sure you want to delete this article? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete({ open: false, id: null })}
        />
      )}
    </div>
  );
};

export default Articles;
