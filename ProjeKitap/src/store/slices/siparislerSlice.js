import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSiparislerAsync = createAsyncThunk(
  'siparisler/fetchSiparisler',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Siparişler yüklenemedi');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const siparislerSlice = createSlice({
  name: 'siparisler',
  initialState: {
    siparisler: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiparislerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiparislerAsync.fulfilled, (state, action) => {
        state.siparisler = action.payload;
        state.loading = false;
      })
      .addCase(fetchSiparislerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default siparislerSlice.reducer;
