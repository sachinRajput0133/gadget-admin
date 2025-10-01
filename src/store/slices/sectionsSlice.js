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
export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = '' } = params;
      let url = `${CONFIG.API_URL}/sections?page=${page}&limit=${limit}`;
      console.log("ur>>>>",url);
      if (search) url += `&search=${search}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sections');
    }
  }
);

export const fetchSectionById = createAsyncThunk(
  'sections/fetchSectionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/sections/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch section');
    }
  }
);

export const createSection = createAsyncThunk(
  'sections/createSection',
  async (sectionData, { rejectWithValue }) => {
    try {
      console.log("`${CONFIG.API_URL}/sections`",`${CONFIG.API_URL}/sections`);
      const response = await axios.post(
        `${CONFIG.API_URL}/sections`, 
        sectionData, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.details || 
        error.response?.data?.message || 
        'Failed to create section'
      );
    }
  }
);

export const updateSection = createAsyncThunk(
  'sections/updateSection',
  async ({ id, sectionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/sections/${id}`, 
        sectionData, 
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.details || 
        error.response?.data?.message || 
        'Failed to update section'
      );
    }
  }
);

export const deleteSection = createAsyncThunk(
  'sections/deleteSection',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/sections/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete section');
    }
  }
);

export const addArticleToSection = createAsyncThunk(
  'sections/addArticleToSection',
  async ({ sectionId, articleId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/sections/${sectionId}/articles`,
        { articleId },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add article to section');
    }
  }
);

export const removeArticleFromSection = createAsyncThunk(
  'sections/removeArticleFromSection',
  async ({ sectionId, articleId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.API_URL}/sections/${sectionId}/articles/${articleId}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove article from section');
    }
  }
);

const initialState = {
  sections: [],
  section: null,
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

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    clearSectionError: (state) => {
      state.error = null;
      state.createUpdateError = null;
      state.deleteError = null;
    },
    clearSection: (state) => {
      state.section = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sections
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.data;
        state.pagination = {
          page: action.payload.pagination?.current || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0
        };
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Section by ID
      .addCase(fetchSectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.section = action.payload;
      })
      .addCase(fetchSectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Section
      .addCase(createSection.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.sections = [action.payload, ...state.sections];
        state.section = action.payload;
      })
      .addCase(createSection.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Update Section
      .addCase(updateSection.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.sections = state.sections.map(section => 
          section._id === action.payload._id ? action.payload : section
        );
        state.section = action.payload;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Delete Section
      .addCase(deleteSection.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.sections = state.sections.filter(
          section => section._id !== action.payload
        );
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      
      // Add Article to Section
      .addCase(addArticleToSection.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(addArticleToSection.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.sections = state.sections.map(section => 
          section._id === action.payload._id ? action.payload : section
        );
        state.section = action.payload;
      })
      .addCase(addArticleToSection.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      })
      
      // Remove Article from Section
      .addCase(removeArticleFromSection.pending, (state) => {
        state.createUpdateLoading = true;
        state.createUpdateError = null;
      })
      .addCase(removeArticleFromSection.fulfilled, (state, action) => {
        state.createUpdateLoading = false;
        state.sections = state.sections.map(section => 
          section._id === action.payload._id ? action.payload : section
        );
        state.section = action.payload;
      })
      .addCase(removeArticleFromSection.rejected, (state, action) => {
        state.createUpdateLoading = false;
        state.createUpdateError = action.payload;
      });
  },
});

export const { clearSectionError, clearSection } = sectionsSlice.actions;

export default sectionsSlice.reducer;
