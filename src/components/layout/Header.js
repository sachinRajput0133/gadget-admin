import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Header = ({ 
  onCreateClick, 
  onFilterClick, 
  searchTerm = '', 
  onSearchChange, 
  onSearchSubmit 
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { theme, sidebarOpen } = useSelector((state) => state.ui);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/articles')) {
      if (path.includes('/create')) return 'Create Article';
      if (path.includes('/edit')) return 'Edit Article';
      return 'Articles';
    }
    if (path.startsWith('/categories')) {
      if (path.includes('/create')) return 'Create Category';
      if (path.includes('/edit')) return 'Edit Category';
      return 'Categories';
    }
    if (path.startsWith('/sections')) {
      if (path.includes('/create')) return 'Create Section';
      if (path.includes('/edit')) return 'Edit Section';
      return 'Sections';
    }
    if (path.startsWith('/users')) return 'Users';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Admin Panel';
  };

  // Determine if we should show action buttons based on the current route
  const shouldShowActionButtons = () => {
    const path = router.pathname;
    return path === '/dashboard' || 
           path === '/articles' || 
           path === '/categories' || 
           path === '/sections' || 
           path === '/users' || 
           path === '/roles';
  };

  // Get create button text based on current route
  const getCreateButtonText = () => {
    const path = router.pathname;
    if (path === '/articles') return 'New Article';
    if (path === '/categories') return 'New Category';
    if (path === '/sections') return 'New Section';
    if (path === '/users') return 'New User';
    if (path === '/roles') return 'New Role';
    return 'Create';
  };

  return (
    <header className={`bg-white shadow-sm fixed top-0 right-0 h-16 z-10 transition-all duration-300 ${
      sidebarOpen ? 'left-64' : 'left-20'
    }`}>
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
          
          {/* Action Buttons - Only show on list pages */}
          {shouldShowActionButtons() && (
            <div className="ml-6 flex items-center space-x-2">
              {/* Create Button */}
              {onCreateClick && (
                <button
                  onClick={onCreateClick}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <AddIcon className="w-4 h-4 mr-1" />
                  {getCreateButtonText()}
                </button>
              )}
              
              {/* Search Toggle Button */}
              {onSearchSubmit && (
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="inline-flex items-center p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <SearchIcon className="w-5 h-5" />
                </button>
              )}
              
              {/* Filter Button */}
              {onFilterClick && (
                <button
                  onClick={onFilterClick}
                  className="inline-flex items-center p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FilterListIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Search Bar - Conditionally shown */}
          {showSearch && onSearchSubmit && (
            <div className="ml-4 relative">
              <form onSubmit={onSearchSubmit} className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={onSearchChange}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            className="text-gray-600 hover:text-primary-600 transition-colors"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'dark' ? (
              <Brightness7Icon className="w-5 h-5" />
            ) : (
              <Brightness4Icon className="w-5 h-5" />
            )}
          </button>
          
          {/* Notifications */}
          <button className="text-gray-600 hover:text-primary-600 transition-colors">
            <NotificationsIcon className="w-5 h-5" />
          </button>
          
          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
              <AccountCircleIcon className="w-6 h-6" />
              <span className="font-medium">{user?.name || 'Admin'}</span>
            </button>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform scale-0 group-hover:scale-100 transition-transform origin-top-right z-20">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <ExitToAppIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
