import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Giriş başarısız!');
    const data = await response.json();
    localStorage.setItem('token', data.token); // Token'ı kaydet
    return data.user; // user: {id, name, email, isAdmin}
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.ad || userData.name,
        email: userData.email || userData['E-posta Adresi'] || userData.eposta,
        password: userData.password || userData.sifre
      }),
    });
    if (!response.ok) throw new Error('Kayıt başarısız!');
    const data = await response.json();
    localStorage.setItem('token', data.token); // Token'ı kaydet
    return data.user;
  }
);

// Şifremi unuttum: e-posta gönder
export const sendForgotPasswordEmailAsync = createAsyncThunk(
  'auth/sendForgotPasswordEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'E-posta gönderilemedi');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Şifre sıfırla: token ve yeni şifre ile
export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPasswordAsync',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Şifre sıfırlama başarısız');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMeAsync = createAsyncThunk(
  'auth/fetchMe',
  async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Kullanıcı doğrulanamadı');
    return await response.json();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // fetchMeAsync durumları
      .addCase(fetchMeAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMeAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchMeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload || action.error.message;
      });
  },
});

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const response = await fetch('http://localhost:4000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Oturum geçersiz.');
      const user = await response.json();
      return user;
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue('Oturum geçersiz.');
    }
  }
);

export const { logout } = authSlice.actions;
export default authSlice.reducer;
