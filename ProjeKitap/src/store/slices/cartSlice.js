import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = (() => {
  try {
    const persisted = JSON.parse(localStorage.getItem('cart'));
    if (persisted && Array.isArray(persisted.items)) {
      return persisted;
    }
  } catch (e) {}
  return { items: [], total: 0 };
})();

// Async thunk: Sepeti getir
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Sepet alınamadı');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: Sepete ürün ekle/güncelle
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, quantity })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Sepete ekleme başarısız');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: Sepetten ürün çıkar
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (bookId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/cart/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Sepetten çıkarma başarısız');
      return bookId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk: Sepeti temizle
export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Sepeti temizleme başarısız');
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, adet = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.adet += adet;
      } else {
        state.items.push({ ...action.payload, adet });
      }
      state.total = state.items.reduce((total, item) => total + (item.fiyat * item.adet), 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((total, item) => total + (item.fiyat * item.adet), 0);
    },
    updateQuantity: (state, action) => {
      const { id, adet } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.adet = Math.max(0, adet);
        if (item.adet === 0) {
          state.items = state.items.filter(item => item.id !== id);
        }
        state.total = state.items.reduce((total, item) => total + (item.fiyat * item.adet), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.items = (action.payload || []).map(item => ({
          ...item.Book,
          id: item.bookId,
          adet: item.quantity,
        }));
        state.total = state.items.reduce((total, item) => total + (item.fiyat * item.adet), 0);
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // API'den dönen tek ürünü veya güncellenmiş ürünü state'e ekle/güncelle
        const { bookId, quantity, Book } = action.payload;
        // Eğer Book objesi eksikse, urunlerSlice'tan ilgili ürünü bul
        let fullBook = Book;
        if (!fullBook || !fullBook.fiyat) {
          try {
            const urunler = JSON.parse(localStorage.getItem('urunler')) || [];
            fullBook = urunler.find(u => u.id === bookId) || {};
          } catch {}
        }
        const existingItem = state.items.find(item => item.id === bookId);
        if (existingItem) {
          existingItem.adet = quantity;
        } else {
          state.items.push({ ...fullBook, id: bookId, adet: quantity });
        }
        state.total = state.items.reduce((total, item) => total + (item.fiyat * item.adet), 0);
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== Number(action.payload));
        state.total = state.items.reduce((total, item) => total + (item.fiyat * item.adet), 0);
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      });
  }
});

// Sepet değiştiğinde localStorage'a yazan middleware
function persistCartMiddleware(storeAPI) {
  return next => action => {
    const result = next(action);
    const state = storeAPI.getState();
    localStorage.setItem('cart', JSON.stringify(state.cart));
    return result;
  };
}

export { persistCartMiddleware };

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.items.reduce((count, item) => count + item.adet, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
