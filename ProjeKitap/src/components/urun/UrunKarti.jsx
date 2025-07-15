import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, IconButton, Box, Snackbar, Alert } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { addToFavoritesAsync, removeFromFavoritesAsync, selectIsFavorite } from '../../store/slices/favoritesSlice';
import { addToCartAsync } from '../../store/slices/cartSlice';

const UrunKarti = ({ urun, handleClick }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(urun.id));

  const [cartError, setCartError] = React.useState(null);

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCartAsync({ bookId: urun.id, quantity: 1 })).unwrap();
      setCartError(null);
    } catch (err) {
      // Hem string hem obje hata durumunu yakala
      const msg = (err && err.message) || err || '';
      if (typeof msg === 'string' && msg.includes('Stok yetersiz')) {
        setCartError(msg);
      } else {
        setCartError('Sepete eklenirken bir hata oluştu.');
      }
      console.error('Sepete ekleme hatası:', err);
    }
  };


  const handleToggleFavorite = async () => {
    console.log("Favori butonu tıklandı", urun.id, isFavorite);
    if (isFavorite) {
      await dispatch(removeFromFavoritesAsync(urun.id));
    } else {
      await dispatch(addToFavoritesAsync(urun.id));
    }
  };


  if (!urun) return null;

  return (
    <>
      <Snackbar
        open={!!cartError}
        autoHideDuration={4000}
        onClose={() => setCartError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setCartError(null)} severity="error" sx={{ width: '100%' }}>
          {cartError}
        </Alert>
      </Snackbar>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <CardMedia
        component="img"
        height="200"
        image={urun.resimUrl || '/placeholder.png'}
        alt={urun.ad}
        sx={{ objectFit: 'contain', p: 2 }}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          noWrap
          sx={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          {urun.ad}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {urun.yazar}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {/* Puan veya rating bileşeni buraya eklenebilir */}
        </Box>
        <Typography variant="h6" color="primary">
          {urun.fiyat?.toFixed(2)} ₺
        </Typography>
        <Typography variant="body2" color={urun.stok > 0 ? "success.main" : "error.main"}>
          {urun.stok > 0 ? 'Stokta' : 'Tükendi'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleClick}
        >
          İncele
        </Button>
        <Box>
          <IconButton
            size="small"
            onClick={handleAddToCart}
            disabled={urun.stok === 0}
            color="primary"
          >
            <ShoppingCart />
          </IconButton>
          <IconButton onClick={handleToggleFavorite} color={isFavorite ? "secondary" : "default"}>
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </CardActions>
    </Card>
    </>
  );
};

export default UrunKarti;