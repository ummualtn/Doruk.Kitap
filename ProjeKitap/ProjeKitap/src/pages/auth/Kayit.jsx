import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';

const Kayit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    sifre: '',
    sifreTekrar: ''
  });
  const [hata, setHata] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    if (formData.sifre !== formData.sifreTekrar) {
      setHata('Şifreler eşleşmiyor!');
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate('/');
    } catch (error) {
      setHata('Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Üye Ol
          </Typography>

          {hata && <Alert severity="error" sx={{ mb: 2 }}>{hata}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="ad"
              label="Ad"
              name="ad"
              autoComplete="given-name"
              autoFocus
              value={formData.ad}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="soyad"
              label="Soyad"
              name="soyad"
              autoComplete="family-name"
              value={formData.soyad}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifre"
              label="Şifre"
              type="password"
              id="sifre"
              value={formData.sifre}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifreTekrar"
              label="Şifre Tekrar"
              type="password"
              id="sifreTekrar"
              value={formData.sifreTekrar}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Üye Ol
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Zaten hesabınız var mı?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/giris')}
                >
                  Giriş Yap
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Kayit;
