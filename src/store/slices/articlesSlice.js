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
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = params;
      let url = `${CONFIG.API_URL}/articles?page=${page}&limit=${limit}`;
      
      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles');
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/articles/${slug}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch article');
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/articles`, 
        articleData, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.details || 
        error.response?.data?.message || 
        'Failed to create article'
      );
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ slug, articleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/articles/${slug}`, 
        articleData, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.details || 
        error.response?.data?.message || 
        'Failed to update article'
      );
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (slug, { rejectWithValue }) => {
    try {
      await axios.delete(`${CONFIG.API_URL}/articles/${slug}`, getAuthHeader());
      return slug;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete article');
    }
  }
);

export const toggleArticleStatus = createAsyncThunk(
  'articles/toggleArticleStatus',
  async ({ slug, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/articles/${slug}/status`, 
        { status }, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update article status');
    }
  }
);

const initialState = {
  articles: [],
  article: null,
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

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticleError: (state) => {
      state.error = null;
      state.createUpdateError = null;
      state.deleteError = null;
    },
    clearArticle: (state) => {
      state.article = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: action.payload.pagination?.current || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0
        };
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Article by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.articles = [action.payload, ...state.articles];
        state.article = action.payload;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Update Article
      .addCase(updateArticle.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.articles = state.articles.map(article => 
          article.slug === action.payload.slug ? action.payload : article
        );
        state.article = action.payload;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Delete Article
      .addCase(deleteArticle.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.articles = state.articles.filter(
          article => article.slug !== action.payload
        );
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      
      // Toggle Article Status
      .addCase(toggleArticleStatus.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(toggleArticleStatus.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.articles = state.articles.map(article => 
          article.slug === action.payload.slug ? action.payload : article
        );
        if (state.article && state.article.slug === action.payload.slug) {
          state.article = action.payload;
        }
      })
      .addCase(toggleArticleStatus.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      });
  },
});

export const { clearArticleError, clearArticle } = articlesSlice.actions;

export default articlesSlice.reducer;
