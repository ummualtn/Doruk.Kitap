import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { persistCartMiddleware } from './slices/cartSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import urunlerReducer from './slices/urunlerSlice';
import siparislerReducer from './slices/siparislerSlice';

const store = configureStore({
  reducer: {
    urunler: urunlerReducer,
    cart: cartReducer,
    auth: authReducer,
    favorites: favoritesReducer,
    siparisler: siparislerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistCartMiddleware),
});

export default store;
