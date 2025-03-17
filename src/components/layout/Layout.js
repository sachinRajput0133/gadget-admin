import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../../store/slices/authSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  // Check authentication on initial load
  useEffect(() => {
    const publicPaths = ['/login', '/forgot-password', '/reset-password'];
    const isPublicPath = publicPaths.includes(router.pathname);

    if (!isPublicPath) {
      dispatch(checkAuth());
    }
  }, [dispatch, router.pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    const publicPaths = ['/login', '/forgot-password', '/reset-password'];
    const isPublicPath = publicPaths.includes(router.pathname);

    if (!loading && !isAuthenticated && !isPublicPath) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Don't render layout on public pages
  if (router.pathname === '/login' || 
      router.pathname === '/forgot-password' || 
      router.pathname === '/reset-password') {
    return (
      <>
        <main>{children}</main>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white py-4 px-6 border-t border-gray-200">
          <div className="container mx-auto">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Gadget Reviews Admin Panel. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Layout;
