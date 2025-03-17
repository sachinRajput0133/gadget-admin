import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchSections, deleteSection } from '../../store/slices/sectionsSlice';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// Components
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomLink from '../../widget/customLink';
import useReactTable from '../../hooks/table/useTable';
import useSectionsTable from '../../hooks/table/useSectionsTable';
import Table from '../../components/common/Table/Table';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';

const Sections = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sections = [], loading, error } = useSelector((state) => state.sections);
  console.log("🚀 ~ Sections ~ sections:", sections)
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, slug: null });
  
  // Get query params
  const { page = 1, limit = 10, search = '' } = router.query;

  // Fetch sections on page load or query change
  useEffect(() => {
    dispatch(fetchSections({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Memoize filtered sections to prevent unnecessary re-renders
  const filteredSections = useMemo(() => {
    // Ensure we always have an array, even if sections is undefined
    return Array.isArray(sections) ? sections : [];
  }, [sections]);

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

  const handleEditSection = (slug) => {
    if (!slug) return;
    router.push(`/sections/edit/${slug}`);
  };

  const handleDeleteClick = (slug) => {
    if (!slug) return;
    setConfirmDelete({ open: true, slug });
  };

  const handleDelete = async () => {
    if (!confirmDelete.slug) return;
    
    try {
      await dispatch(deleteSection(confirmDelete.slug)).unwrap();
      toast.success('Section deleted successfully');
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
  const handleEditMemoized = useMemo(() => handleEditSection, []);
  const handleDeleteMemoized = useMemo(() => handleDeleteClick, []);


  const { columns } = useSectionsTable({
    onEdit: handleEditMemoized || (() => {}),
    onDelete: handleDeleteMemoized || (() => {})
  });

  const { tableInstance } = useReactTable(columns, filteredSections ?? []);
  console.log("🚀 ~ Sections ~ tableInstance:", tableInstance)

  // Only render the table if we have all the required properties
  const canRenderTable = useMemo(() => {
    return tableInstance && 
           tableInstance.getTableProps && 
           tableInstance.getTableBodyProps && 
           tableInstance.headerGroups && 
           Array.isArray(tableInstance.page);
  }, [tableInstance]);

  return (
    <Layout title="Sections Management">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Sections
          </Typography>
          <CustomLink href="/sections/create">
            <AddIcon className="mr-1 h-5 w-5" />
            Create Section
          </CustomLink>
        </Box>

        <Box sx={{ mb: 3 }}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-grow">
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sections..."
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

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <Typography>Loading sections...</Typography>
          </Box>
        ) : !canRenderTable ? (
          <Box display="flex" justifyContent="center" my={4}>
            <Typography>No sections available</Typography>
          </Box>
        ) : (
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
            totalCount={(filteredSections || []).length}
            pageCount={tableInstance.pageCount}
          />
        )}
      </Box>

      {/* <ConfirmDialog
        open={false || confirmDelete.open}
        title="Delete Section"
        content="Are you sure you want to delete this section? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      /> */}
    </Layout>
  );
};

export default Sections;