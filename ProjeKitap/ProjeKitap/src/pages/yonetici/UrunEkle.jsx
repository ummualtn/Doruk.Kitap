import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { urunEkleAsync, fetchUrunlerAsync } from '../../store/slices/urunlerSlice';
import kategoriIsimdenSlug from '../kategoriler/kategoriSlugMap';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';

const kategoriler = [
  'Ana Sınıfı Kitapları',
  'İlk Okul Kitapları',
  'Okul Öncesi Kitapları',
  'Orta Okul Kitapları',
  'Hobi Oyunları',
  'Okuma Kitapları',
  'Deneme Sınavları',
  'Sözlükler ve Ansiklopediler'
];

const UrunEkle = ({ open, onClose }) => {
  const [urun, setUrun] = useState({
    ad: '',
    kategori: '',
    kategoriSlug: '',
    fiyat: '',
    stok: '',
    aciklama: '',
    yayinevi: '',
    yazar: '',
    sayfaSayisi: '',
    isbn: '',
    resimUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Kategori alanı değiştiyse hem adı hem slug'ı ayarla
    if (name === 'kategori') {
      setUrun(prev => ({
        ...prev,
        kategori: value,
        kategoriSlug: kategoriIsimdenSlug[value] || ''
      }));
    } else {
      setUrun(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(urunEkleAsync(urun)).then(() => {
      dispatch(fetchUrunlerAsync());
    });
    onClose();
    setUrun({
      ad: '',
      kategori: '',
      kategoriSlug: '',
      fiyat: '',
      stok: '',
      aciklama: '',
      yayinevi: '',
      yazar: '',
      sayfaSayisi: '',
      isbn: '',
      resimUrl: ''
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ürün Adı"
                name="ad"
                value={urun.ad}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="kategori"
                  value={urun.kategori}
                  onChange={handleChange}
                  label="Kategori"
                >
                  {kategoriler.map((kategori) => (
                    <MenuItem key={kategori} value={kategori}>
                      {kategori}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yayınevi"
                name="yayinevi"
                value={urun.yayinevi}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yazar"
                name="yazar"
                value={urun.yazar}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={urun.isbn}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Fiyat (TL)"
                name="fiyat"
                type="number"
                value={urun.fiyat}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stok Adedi"
                name="stok"
                type="number"
                value={urun.stok}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sayfa Sayısı"
                name="sayfaSayisi"
                type="number"
                value={urun.sayfaSayisi}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resim URL"
                name="resimUrl"
                value={urun.resimUrl}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="aciklama"
                value={urun.aciklama}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained" color="primary">
            Ürün Ekle
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UrunEkle;
