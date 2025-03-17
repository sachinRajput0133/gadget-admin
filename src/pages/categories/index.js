import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchCategories, deleteCategory } from '../../store/slices/categoriesSlice';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// Components
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomLink from '../../widget/customLink';
import useReactTable from '../../hooks/table/useTable';
import useCategoriesTable from '../../hooks/table/useCategoriesTable';
import Table from '../../components/common/Table/Table';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';

const Categories = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories = [], loading, error } = useSelector((state) => state.categories);
  
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

  // Memoize filtered categories to prevent unnecessary re-renders
  const filteredCategories = useMemo(() => {
    return categories || [];
  }, [categories]);

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

  const handleEditCategory = (slug) => {
    router.push(`/categories/edit/${slug}`);
  };

  const handleDeleteClick = (slug) => {
    if (slug) {
      setConfirmDelete({ open: true, slug });
    }
  };

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

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, slug: null });
  };

  // Memoize callbacks for table actions to prevent re-renders
  const handleEditMemoized = useMemo(() => handleEditCategory, []);
  const handleDeleteMemoized = useMemo(() => handleDeleteClick, []);

  // Use the dedicated categories table hook with memoized callbacks
  const { columns } = useCategoriesTable({
    onEdit: handleEditMemoized,
    onDelete: handleDeleteMemoized
  });

  // Memoize the table instance to prevent re-renders
  const { tableInstance } = useReactTable(columns, filteredCategories ?? []);


  return (
    <Layout title="Categories Management">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Categories
          </Typography>
          <CustomLink href="/categories/create">
            <AddIcon className="mr-1 h-5 w-5" />
            Create Category
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
                placeholder="Search categories..."
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

        {/* Categories Table */}
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
          totalCount={(filteredCategories || []).length}
          pageCount={tableInstance.pageCount}
        />
      </Box>

      {/* Confirm Delete Dialog */}
      {/* <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Category"
        content="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      /> */}
    </Layout>
  );
};

export default Categories;
