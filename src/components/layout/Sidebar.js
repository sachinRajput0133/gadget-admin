import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SecurityIcon from '@mui/icons-material/Security';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CustomLink from '../../widget/customLink';

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  // Define sidebar items
  const sidebarItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <DashboardIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Articles', 
      path: '/articles', 
      icon: <ArticleIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Categories', 
      path: '/categories', 
      icon: <CategoryIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Sections', 
      path: '/sections', 
      icon: <ViewCarouselIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Users', 
      path: '/users', 
      icon: <PeopleIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Roles & Permissions', 
      path: '/roles', 
      icon: <SecurityIcon className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <SettingsIcon className="w-5 h-5" /> 
    }
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 flex flex-col transition-all duration-300 bg-gradient-to-b from-blue-900 to-indigo-900 shadow-xl ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800/50">
          <div className="flex items-center">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold text-white">Gadget Admin</h1>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
                <h1 className="text-xl font-bold text-white">G</h1>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <MenuOpenIcon className={`transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
          <ul className="px-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = router.pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <CustomLink href={item.path}>
                    <div
                      className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/15 text-white' 
                          : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
                      {sidebarOpen && <span className="font-medium">{item.name}</span>}
                    </div>
                  </CustomLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="mt-auto border-t border-blue-800/30">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors ${
              sidebarOpen ? 'justify-start space-x-3' : 'justify-center'
            }`}
          >
            <ExitToAppIcon className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="py-4 px-4 border-t border-blue-800/50">
          {sidebarOpen && (
            <p className="text-xs text-blue-200/70">
              &copy; {new Date().getFullYear()} Gadget Reviews
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
