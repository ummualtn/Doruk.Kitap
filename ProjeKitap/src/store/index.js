import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import urunlerReducer from './slices/urunlerSlice';
import searchReducer from './slices/searchSlice';

import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    urunler: urunlerReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    search: searchReducer,
    auth: authReducer,
  },
});

export default store;
