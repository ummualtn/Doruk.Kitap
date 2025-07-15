import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk: Ürünleri API'den çek
export const fetchUrunlerAsync = createAsyncThunk(
  'urunler/fetchUrunler',
  async () => {
    const response = await fetch('/api/books'); // Doğru endpoint
    if (!response.ok) throw new Error('Ürünler alınamadı');
    const data = await response.json();
    return data.books; // Sadece books dizisini döndür
  }
);

// Async thunk: Ürün ekle
export const urunEkleAsync = createAsyncThunk(
  'urunler/urunEkle',
  async (yeniUrun) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(yeniUrun)
    });
    if (!response.ok) throw new Error('Ürün eklenemedi');
    return await response.json();
  }
);

// Async thunk: Ürün güncelle
export const urunGuncelleAsync = createAsyncThunk(
  'urunler/urunGuncelle',
  async (guncellenenUrun) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/books/${guncellenenUrun.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(guncellenenUrun)
    });
    if (!response.ok) throw new Error('Ürün güncellenemedi');
    const data = await response.json();
    return data.book;
  }
);

// Async thunk: Ürün sil
export const urunSilAsync = createAsyncThunk(
  'urunler/urunSil',
  async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      let msg = 'Ürün silinemedi';
      try {
        const err = await response.json();
        msg += ': ' + (err.message || JSON.stringify(err));
      } catch {}
      throw new Error(msg);
    }
    return id;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const urunlerSlice = createSlice({
  name: 'urunler',
  initialState,
  reducers: {
    urunEkle: (state, action) => {
      state.items.push({
        id: Date.now().toString(),
        ...action.payload
      });
    },
    urunGuncelle: (state, action) => {
      const index = state.items.findIndex(urun => urun.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    urunSil: (state, action) => {
      state.items = state.items.filter(urun => urun.id !== action.payload);
    },
    stokGuncelle: (state, action) => {
      const { id, miktar } = action.payload;
      const urun = state.items.find(item => item.id === id);
      if (urun) {
        urun.stok = Math.max(0, urun.stok + miktar);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUrunlerAsync
      .addCase(fetchUrunlerAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUrunlerAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // Ürünleri localStorage'a kaydet
        try {
          localStorage.setItem('urunler', JSON.stringify(action.payload));
        } catch (e) {}
      })
      .addCase(fetchUrunlerAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // urunEkleAsync
      .addCase(urunEkleAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(urunEkleAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(urunEkleAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // urunGuncelleAsync
      .addCase(urunGuncelleAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(urunGuncelleAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(urun => urun.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(urunGuncelleAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // urunSilAsync
      .addCase(urunSilAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(urunSilAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(urun => urun.id !== action.payload);
      })
      .addCase(urunSilAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { urunEkle, urunGuncelle, urunSil, stokGuncelle } = urunlerSlice.actions;

export const selectTumUrunler = (state) => state.urunler.items;
export const selectUrunById = (state, urunId) => 
  state.urunler.items.find(urun => urun.id === urunId);
export const selectUrunlerByKategori = (state, kategoriSlug) =>
  state.urunler.items.filter(
    urun =>
      urun.kategoriSlug === kategoriSlug
  );

export default urunlerSlice.reducer;
