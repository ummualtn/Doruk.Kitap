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
import { sendForgotPasswordEmailAsync } from '../../store/slices/authSlice';

const SifremiUnuttum = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [durum, setDurum] = useState({ tip: '', mesaj: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDurum({ tip: '', mesaj: '' });

    try {
      await dispatch(sendForgotPasswordEmailAsync(email)).unwrap();
      setDurum({
        tip: 'success',
        mesaj: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
      });
    } catch (error) {
      setDurum({
        tip: 'error',
        mesaj: 'Şifre sıfırlama işlemi başarısız oldu. Lütfen e-posta adresinizi kontrol edin.'
      });
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
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Şifremi Unuttum
          </Typography>

          <Typography variant="body2" align="center" sx={{ mb: 3 }}>
            E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
          </Typography>

          {durum.mesaj && (
            <Alert severity={durum.tip} sx={{ mb: 2 }}>
              {durum.mesaj}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Şifre Sıfırlama Bağlantısı Gönder
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/giris')}
              >
                Giriş sayfasına dön
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SifremiUnuttum;
