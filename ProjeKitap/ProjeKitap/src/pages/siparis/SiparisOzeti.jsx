import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { selectCartItems, selectCartTotal } from '../../store/slices/cartSlice';

const SiparisOzeti = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleOdemeYap = () => {
    navigate('/odeme');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sipariş Özeti
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sipariş Detayları
            </Typography>
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={item.baslik}
                      secondary={`${item.adet} adet x ${item.fiyat.toFixed(2)} TL`}
                    />
                    <Typography variant="body1">
                      {(item.adet * item.fiyat).toFixed(2)} TL
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ödeme Özeti
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>Ara Toplam:</Typography>
                </Grid>
                <Grid item>
                  <Typography>{cartTotal.toFixed(2)} TL</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                <Grid item>
                  <Typography>Kargo Ücreti:</Typography>
                </Grid>
                <Grid item>
                  <Typography>0.00 TL</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="h6">Toplam:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">{cartTotal.toFixed(2)} TL</Typography>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={handleOdemeYap}
              >
                Ödeme Yap
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SiparisOzeti;
