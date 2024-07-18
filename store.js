// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './context/reducers'; // Import the combined reducers here

// const middleware = [
//   thunk,
//   ...getDefaultMiddleware({
//     serializableCheck: false, // Disable serializableCheck as redux-persist actions are not serializable
//   }),
// ];

export const store = configureStore({
  reducer: rootReducer, // Pass the combined reducers here
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);