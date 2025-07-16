import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
  clearCartAsync,
} from '../../store/slices/cartSlice';

const Sepetim = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);

  const handleQuantityChange = (id, adet) => {
    dispatch(updateQuantity({ id, adet }));
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleClearCart = () => {
    setClearDialogOpen(true);
  };

  const confirmClearCart = async () => {
    await dispatch(clearCartAsync());
    setClearDialogOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Sepetiniz Boş
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sepetinizde ürün bulunmamaktadır.
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
      <Typography variant="h4" gutterBottom>
        Sepetim
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="center">Adet</TableCell>
              <TableCell align="right">Toplam</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.resimUrl}
                      alt={item.ad}
                      style={{ width: 50, marginRight: 16 }}
                    />
                    <div>
                      <Typography variant="subtitle1">{item.ad}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.yazar}
                      </Typography>
                    </div>
                  </Box>
                </TableCell>
                <TableCell align="right">{item.fiyat} TL</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.adet - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      value={item.adet}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        handleQuantityChange(item.id, value);
                      }}
                      inputProps={{
                        style: { textAlign: 'center' },
                        min: 1,
                        max: item.stok,
                      }}
                      sx={{ width: 60, mx: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.adet + 1)}
                      disabled={item.adet >= item.stok}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {(item.fiyat * item.adet).toFixed(2)} TL
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart}
                  startIcon={<DeleteIcon />}
                >
                  Sepeti Boşalt
                </Button>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">
                  Toplam: {total.toFixed(2)} TL
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/odeme')}
                >
                  Satın Al
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Ürün Silme Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Ürünü Sepetten Kaldır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {itemToDelete?.ad} adlı ürünü sepetten kaldırmak istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Kaldır
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sepeti Boşaltma Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
        <DialogTitle>Sepeti Boşalt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sepetinizdeki tüm ürünleri kaldırmak istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmClearCart} color="error" variant="contained">
            Sepeti Boşalt
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sepetim;
