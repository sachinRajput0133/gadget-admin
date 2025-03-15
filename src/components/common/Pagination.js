import React from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      pageNumbers.push(1);
      
      // Calculate middle pages
      const leftBoundary = Math.max(2, currentPage - 1);
      const rightBoundary = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed before left boundary
      if (leftBoundary > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed after right boundary
      if (rightBoundary < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Add last page if not already added
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            isFirstPage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => !isLastPage && onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            isLastPage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                isFirstPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <NavigateBeforeIcon className="h-5 w-5" />
            </button>
            
            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => page !== currentPage && onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            
            {/* Next Button */}
            <button
              onClick={() => !isLastPage && onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                isLastPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <NavigateNextIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
