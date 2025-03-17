import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchArticles, deleteArticle } from '../../store/slices/articlesSlice';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// Components
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomLink from '../../widget/customLink';
import useReactTable from '../../hooks/table/useTable';
import useArticlesTable from '../../hooks/table/useArticlesTable';
import Table from '../../components/common/Table/Table';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';

const Articles = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { articles = [], loading, error } = useSelector((state) => state.articles);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, slug: null });
  
  // Get query params
  const { page = 1, limit = 10, search = '' } = router.query;

  // Fetch articles on page load or query change
  useEffect(() => {
    dispatch(fetchArticles({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Memoize filtered articles to prevent unnecessary re-renders
  const filteredArticles = useMemo(() => {
    return articles || [];
  }, [articles]);

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

  const handleViewArticle = (slug) => {
    // Open in a new tab using the frontend URL
    window.open(`/article/${slug}`, '_blank');
  };

  const handleEditArticle = (slug) => {
    router.push(`/articles/edit/${slug}`);
  };

  const handleDeleteClick = (slug) => {
    if (slug) {
      setConfirmDelete({ open: true, slug });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.slug) return;
    
    try {
      await dispatch(deleteArticle(confirmDelete.slug)).unwrap();
      toast.success('Article deleted successfully');
      setConfirmDelete({ open: false, slug: null });
    } catch (error) {
      toast.error(error);
      setConfirmDelete({ open: false, slug: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, slug: null });
  };

  // Memoize callbacks for table actions to prevent re-renders
  const handleViewMemoized = useMemo(() => handleViewArticle, []);
  const handleEditMemoized = useMemo(() => handleEditArticle, []);
  const handleDeleteMemoized = useMemo(() => handleDeleteClick, []);

  // Use the dedicated articles table hook with memoized callbacks
  const { columns } = useArticlesTable({
    onView: handleViewMemoized,
    onEdit: handleEditMemoized,
    onDelete: handleDeleteMemoized
  });

  // Memoize the table instance to prevent re-renders
  const { tableInstance } = useReactTable(columns, filteredArticles ?? []);

  return (
    <Layout title="Articles Management">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Articles
          </Typography>
          <CustomLink href="/articles/create">
            <AddIcon className="mr-1 h-5 w-5" />
            Create Article
          </CustomLink>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-grow">
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </form>
        </Box>

        {/* Articles Table */}
        <Table 
          getTableProps={tableInstance.getTableProps}
          getTableBodyProps={tableInstance.getTableBodyProps}
          headerGroups={tableInstance.headerGroups}
          page={tableInstance.page}
          prepareRow={tableInstance.prepareRow}
          state={tableInstance.state}
          gotoPage={tableInstance.gotoPage}
          setPageSize={tableInstance.setPageSize}
          loading={loading}
          totalCount={(filteredArticles || []).length}
          pageCount={tableInstance.pageCount}
        />
      </Box>

      {/* Confirm Delete Dialog */}
      {/* <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Article"
        content="Are you sure you want to delete this article? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      /> */}
    </Layout>
  );
};

export default Articles;