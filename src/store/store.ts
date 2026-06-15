import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import blogReducer from './blogSlice';
import landingReducer from './landingSlice';
// ----------------------------------------------------------------------

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    landing: landingReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


