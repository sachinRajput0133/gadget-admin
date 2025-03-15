import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import articlesReducer from './slices/articlesSlice';
import categoriesReducer from './slices/categoriesSlice';
import sectionsReducer from './slices/sectionsSlice';
import uiReducer from './slices/uiSlice';
import rolesReducer from './slices/roleSlice';
import usersReducer from './slices/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    categories: categoriesReducer,
    sections: sectionsReducer,
    ui: uiReducer,
    roles: rolesReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
