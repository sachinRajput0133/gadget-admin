import React from 'react';
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

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { theme, sidebarOpen } = useSelector((state) => state.ui);

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

  return (
    <header className={`bg-white shadow-sm fixed top-0 right-0 h-16 z-10 transition-all duration-300 ${
      sidebarOpen ? 'left-64' : 'left-20'
    }`}>
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        
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
