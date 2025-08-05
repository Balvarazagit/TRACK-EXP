import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features_slice/auth/authSlice';
import expenseReducer from '../features_slice/expenses/expenseSlice';
import flatmateReducer from '../features_slice/flatmate/flatmateSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    flatmate: flatmateReducer,
  },
});

export default store;