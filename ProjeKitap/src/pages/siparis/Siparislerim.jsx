import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiparislerAsync } from '../../store/slices/siparislerSlice';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const Siparislerim = () => {
  const dispatch = useDispatch();
  const { siparisler = [], loading = false, error = null } = useSelector(state => state.siparisler || {});

  useEffect(() => {
    dispatch(fetchSiparislerAsync());
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Siparişlerim</Typography>
      {loading && <Typography>Yükleniyor...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3}>
        {siparisler && siparisler.length === 0 && (
          <Typography sx={{ mt: 4, mx: 'auto' }}>Hiç siparişiniz yok.</Typography>
        )}
        {siparisler && siparisler.map((siparis) => (
          <Grid item xs={12} md={6} key={siparis.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{siparis.book?.ad}</Typography>
                <Typography>Adet: {siparis.quantity}</Typography>
                <Typography>Tarih: {new Date(siparis.createdAt).toLocaleString()}</Typography>
                <Typography>Durum: {siparis.status}</Typography>
                <Typography>Tutar: {siparis.book ? (siparis.book.fiyat * siparis.quantity).toFixed(2) : '-'} ₺</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>Detay</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Siparislerim;
