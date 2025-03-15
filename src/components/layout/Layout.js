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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="pt-24 pb-8 px-6">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Layout;
