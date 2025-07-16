import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  selectFavoriteItems,
  removeFromFavoritesAsync,
  clearFavorites,
  fetchFavoritesAsync,
} from '../../store/slices/favoritesSlice';
import { addToCart } from '../../store/slices/cartSlice';

const Favorilerim = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchFavoritesAsync());
  }, [dispatch]);
  const navigate = useNavigate();
  const favoriteItems = useSelector(selectFavoriteItems);
console.log('Favorilerim favoriteItems:', favoriteItems);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromFavoritesAsync(itemToDelete.id));
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleClearFavorites = () => {
    setClearDialogOpen(true);
  };

  const confirmClearFavorites = () => {
    dispatch(clearFavorites());
    setClearDialogOpen(false);
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, adet: 1 }));
  };

  if (favoriteItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <FavoriteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Favori Listeniz Boş
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Favori listenizde ürün bulunmamaktadır.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Alışverişe Başla
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Favorilerim
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFavorites}
            startIcon={<DeleteIcon />}
          >
            Listeyi Temizle
          </Button>
        </Grid>

        {favoriteItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.resimUrl}
                alt={item.ad}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {item.ad}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.yazar}
                </Typography>
                <Typography variant="h6" color="primary">
                  {item.fiyat} TL
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(item)}
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(item)}
                >
                  Sepete Ekle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ürün Silme Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Favorilerden Kaldır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {itemToDelete?.ad} adlı ürünü favorilerden kaldırmak istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Kaldır
          </Button>
        </DialogActions>
      </Dialog>

      {/* Listeyi Temizleme Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
        <DialogTitle>Favori Listesini Temizle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tüm favorilerinizi silmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmClearFavorites} color="error" variant="contained">
            Temizle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Favorilerim;
