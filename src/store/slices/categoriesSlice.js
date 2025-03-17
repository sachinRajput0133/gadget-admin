import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import CONFIG from '../../../config/env';


// Helper function to set auth header
const getAuthHeader = () => {
  const token = Cookies.get('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = '' } = params;
      let url = `${CONFIG.API_URL}/categories?page=${page}&limit=${limit}`;
      
      if (search) url += `&search=${search}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/categories/${slug}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/categories`, 
        categoryData, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.details || 
        error.response?.data?.message || 
        'Failed to create category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ slug, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/categories/${slug}`, 
        categoryData, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.details || 
        error.response?.data?.message || 
        'Failed to update category'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (slug, { rejectWithValue }) => {
    try {
      await axios.delete(`${CONFIG.API_URL}/categories/${slug}`, getAuthHeader());
      return slug;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  categories: [],
  category: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  loading: false,
  error: null,
  createUpdateLoading: false,
  createUpdateError: null,
  deleteLoading: false,
  deleteError: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
      state.createUpdateError = null;
      state.deleteError = null;
    },
    clearCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.pagination = {
          page: action.payload.pagination?.current || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Category by Slug
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.categories = [action.payload, ...state.categories];
        state.category = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.categories = state.categories.map(category => 
          category.slug === action.payload.slug ? action.payload : category
        );
        state.category = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.categories = state.categories.filter(
          category => category.slug !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { clearCategoryError, clearCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;
