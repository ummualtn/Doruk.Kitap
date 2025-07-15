import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPasswordAsync } from '../../store/slices/authSlice';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ tip: '', mesaj: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ tip: '', mesaj: '' });
    if (password.length < 6) {
      setStatus({ tip: 'error', mesaj: 'Şifre en az 6 karakter olmalı.' });
      return;
    }
    if (password !== confirm) {
      setStatus({ tip: 'error', mesaj: 'Şifreler eşleşmiyor.' });
      return;
    }
    setLoading(true);
    try {
      await dispatch(resetPasswordAsync({ token, password })).unwrap();
      setStatus({ tip: 'success', mesaj: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.' });
      setTimeout(() => navigate('/giris'), 2000);
    } catch (err) {
      setStatus({ tip: 'error', mesaj: err || 'Şifre sıfırlama başarısız.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Yeni Şifre Belirle
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3 }}>
            Lütfen yeni şifrenizi girin.
          </Typography>
          {status.mesaj && (
            <Alert severity={status.tip} sx={{ mb: 2 }}>{status.mesaj}</Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Yeni Şifre"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Yeni Şifre (Tekrar)"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Şifreyi Güncelle
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
