
import { configureStore } from '@reduxjs/toolkit';
import appReducers  from '../src/reducers/index'
import thunk from 'redux-thunk';
export const store = configureStore({
  reducer: {
    appReducers
  },
  middleware: [thunk],
});