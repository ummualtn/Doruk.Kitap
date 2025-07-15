import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

const steps = [
  'Sipariş Alındı',
  'Onaylandı',
  'Hazırlanıyor',
  'Kargoya Verildi',
  'Teslim Edildi',
];

const SiparisDurumu = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Siparişler alınamadı.');
        const data = await res.json();
        setOrders(data.orders || data); // API response'a göre uyarlanabilir
      } catch (err) {
        setError(err.message || 'Siparişler alınırken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Sipariş Durumu
        </Typography>

        {loading ? (
          <Typography>Yükleniyor...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : orders.length === 0 ? (
          <Typography>Henüz siparişiniz yok.</Typography>
        ) : (
          orders.map((order, idx) => (
            <Box key={order.id || idx} mb={4}>
              <Stepper activeStep={order.status || 0} alternativeLabel sx={{ mt: 3, mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sipariş Bilgileri
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Sipariş Tarihi:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Durum:</strong> {steps[order.status] || steps[0]}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Ürün:</strong> {order.Book ? order.Book.ad : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Adet:</strong> {order.quantity || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default SiparisDurumu;
