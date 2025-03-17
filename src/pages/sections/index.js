import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchSections, deleteSection } from "../../store/slices/sectionsSlice";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Components
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useReactTable from "../../hooks/table/useTable";
import useSectionsTable from "../../hooks/table/useSectionsTable";
import Table from "../../components/common/Table/Table";
import SectionFormDrawer from "../../components/sections/SectionFormDrawer";

const Sections = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    sections = [],
    loading,
    error,
  } = useSelector((state) => state.sections);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    slug: null,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get query params
  const { page = 1, limit = 10, search = "" } = router.query;

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
    Object.keys(query).forEach((key) => !query[key] && delete query[key]);

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const handleRefresh = () => {
    dispatch(fetchSections({ page, limit, search }));
  };

  const handleEditSection = (slug) => {
    if (!slug) return;
    const sectionToEdit = filteredSections.find(
      (section) => section.slug === slug
    );
    if (sectionToEdit) {
      setSectionToEdit(sectionToEdit);
      setDrawerOpen(true);
    }
  };

  const handleCreateSection = () => {
    setSectionToEdit(null);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (slug) => {
    if (!slug) return;
    setConfirmDelete({ open: true, slug });
  };

  const handleDelete = async () => {
    if (!confirmDelete.slug) return;

    try {
      await dispatch(deleteSection(confirmDelete.slug)).unwrap();
      toast.success("Section deleted successfully");
      setConfirmDelete({ open: false, slug: null });
    } catch (error) {
      toast.error(error);
      setConfirmDelete({ open: false, slug: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, slug: null });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSectionToEdit(null);
  };

  const handleFormSuccess = () => {
    dispatch(fetchSections({ page, limit, search }));
  };

  // Memoize callbacks for table actions to prevent re-renders
  const handleEditMemoized = useMemo(() => handleEditSection, []);
  const handleDeleteMemoized = useMemo(() => handleDeleteClick, []);

  const { columns } = useSectionsTable({
    onEdit: handleEditMemoized || (() => {}),
    onDelete: handleDeleteMemoized || (() => {}),
  });

  const { tableInstance } = useReactTable(columns, filteredSections ?? []);

  // Only render the table if we have all the required properties
  const canRenderTable = useMemo(() => {
    return (
      tableInstance &&
      tableInstance.getTableProps &&
      tableInstance.getTableBodyProps &&
      tableInstance.headerGroups &&
      Array.isArray(tableInstance.page)
    );
  }, [tableInstance]);

  return (
    <Layout title="Sections Management">
      <div className="mb-6 w-full bg-white border-black">
        {/* Page Header */}
        <header
          className={`bg-white shadow-sm fixed top-0 left-0 h-16 z-10 transition-all duration-300 border pl-72 w-full pr-6 flex justify-between`}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage sections for organizing your articles
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 bg-white hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Refresh"
            >
              <RefreshIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 bg-white hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Filter"
            >
              <FilterListIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCreateSection}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <AddIcon className="w-5 h-5 mr-1.5" />
              Create Section
            </button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
          >
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sections..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>

          {/* Advanced Filters - Hidden by default */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Advanced Filters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="wearables">Wearables</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Created Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {loading && !canRenderTable ? (
          <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading sections...</p>
            </div>
          </div>
        ) : !canRenderTable ? (
          <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No sections available
              </h3>
              <p className="mt-1 text-gray-500 max-w-md">
                Get started by creating your first section to organize your
                articles.
              </p>
              <button
                onClick={handleCreateSection}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <AddIcon className="w-5 h-5 mr-1.5" />
                Create Section
              </button>
            </div>
          </div>
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
      </div>

      {/* Confirm Delete Dialog */}
      {/* <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Section"
        content="Are you sure you want to delete this section? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      /> */}

      {/* Section Form Drawer */}
      <SectionFormDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        sectionToEdit={sectionToEdit}
        onSuccess={handleFormSuccess}
      />
    </Layout>
  );
};

export default Sections;
