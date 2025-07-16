import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

// Async thunk: Favorileri getir
export const fetchFavoritesAsync = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const res = await fetch(`${API_BASE}/api/favorite`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Favoriler alınamadı');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: Favoriye ekle
export const addToFavoritesAsync = createAsyncThunk(
  'favorites/addToFavorites',
  async (bookId, { rejectWithValue }) => {
    try {
      console.log('[FAVORITE][THUNK][START] bookId:', bookId);
      const token = localStorage.getItem('token');
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const res = await fetch(`${API_BASE}/api/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId })
      });
      console.log('[FAVORITE][THUNK][FETCH] status:', res.status);
      if (!res.ok) {
        const errText = await res.text();
        console.error('[FAVORITE][THUNK][ERROR]', res.status, errText);
        throw new Error('Favoriye ekleme başarısız');
      }
      const json = await res.json();
      console.log('[FAVORITE][THUNK][SUCCESS]', json);
      return json;
    } catch (err) {
      console.error('[FAVORITE][THUNK][CATCH]', err);
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: Favoriden çıkar
export const removeFromFavoritesAsync = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (bookId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const res = await fetch(`${API_BASE}/api/favorite/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Favoriden çıkarma başarısız');
      return bookId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: Tüm favorileri sil
export const clearFavorites = createAsyncThunk(
  'favorites/clearFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/api/favorite/clear/all`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Favoriler silinemedi');
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleFavorite: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesAsync.fulfilled, (state, action) => {
        // Favoriler backend'den [{id, userId, bookId, Book: {...}}] şeklinde geliyor
        // Frontend ise doğrudan kitap objesiyle çalışıyor, id olarak da bookId'yi bekliyor
        state.items = (action.payload || [])
          .filter(item => item.Book && item.bookId)
          .map(item => ({
            ...item.Book,
            id: item.bookId
          }));
      })
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.bookId && action.payload.Book) {
          const exists = state.items.some(item => item.id === action.payload.bookId);
          if (!exists) {
            state.items.push({ ...action.payload.Book, id: action.payload.bookId });
          }
        }
      })
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== Number(action.payload));
      })
      .addCase(clearFavorites.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite 
} = favoritesSlice.actions;

// Favori kitaplar array'ini döndürür
export const selectFavoriteItems = (state) => state.favorites.items;
// Selector factory: id ile favori mi kontrol eder
export const selectIsFavorite = (id) => (state) => {
  if (!id) return false;
  return state.favorites.items.some(item => String(item.id) === String(id));
};

export default favoritesSlice.reducer;
