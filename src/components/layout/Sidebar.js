import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SecurityIcon from '@mui/icons-material/Security';
import CustomLink from '../../widget/customLink';

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

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
      className={`bg-white h-screen shadow-md transition-all duration-300 fixed left-0 top-0 z-10 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="py-6 px-4 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold text-primary-600">AP</h1>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-500 hover:text-primary-600 transition-colors"
          >
            <MenuOpenIcon className={`transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 py-6 px-2 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = router.pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <CustomLink href={item.path}>
                    {/* <a
                      className={`sidebar-link ${isActive ? 'active' : ''}`}
                    > */}
                      <span className="mr-3">{item.icon}</span>
                      {sidebarOpen && <span>{item.name}</span>}
                    {/* </a> */}
                  </CustomLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="py-4 px-4 border-t border-gray-200">
          {sidebarOpen && (
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Gadget Reviews
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
