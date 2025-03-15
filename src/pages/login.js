import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // Show error toast if login fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data) => {
    await dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-600">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`form-input w-full ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <div className="error-text">{errors.email.message}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`form-input w-full ${errors.password ? 'border-red-500' : ''}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <div className="error-text">{errors.password.message}</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
