import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Button
} from '@mui/material';
import { selectUrunlerByKategori, fetchUrunlerAsync } from '../../store/slices/urunlerSlice';
import UrunKarti from '../urun/UrunKarti';

const KategoriSayfasi = ({ kategoriSlug, kategoriBaslik, kategoriAciklama }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const urunler = useSelector((state) => selectUrunlerByKategori(state, kategoriSlug));

  // Sonsuz döngüyü engellemek için sadece dispatch'e bağlı
  useEffect(() => {
    if (!urunler || urunler.length === 0) {
      dispatch(fetchUrunlerAsync());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
  const [siralama, setSiralama] = useState('');
  const [fiyatAralik, setFiyatAralik] = useState({ min: '', max: '' });
  const [seciliYazar, setSeciliYazar] = useState('');
  const [seciliYayinevi, setSeciliYayinevi] = useState('');
  const [stoktaOlanlar, setStoktaOlanlar] = useState(false);
  const [filtrelenmisUrunler, setFiltrelenmisUrunler] = useState(urunler);

  // Kategorideki benzersiz yazar ve yayınevleri (dropdown için)
  const yazarlar = Array.from(new Set(urunler.map(u => u.yazar).filter(Boolean)));
  const yayinevleri = Array.from(new Set(urunler.map(u => u.yayinevi).filter(Boolean)));

  useEffect(() => {
    let yeniFiltrelenmisUrunler = [...urunler];

    if (seciliYazar) {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => (urun.yazar || '').trim().toLowerCase() === seciliYazar.trim().toLowerCase()
      );
    }
    if (seciliYayinevi) {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => (urun.yayinevi || '').trim().toLowerCase() === seciliYayinevi.trim().toLowerCase()
      );
    }
    if (stoktaOlanlar) {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => urun.stok > 0
      );
    }
    if (fiyatAralik.min !== '') {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => urun.fiyat >= Number(fiyatAralik.min)
      );
    }
    if (fiyatAralik.max !== '') {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => urun.fiyat <= Number(fiyatAralik.max)
      );
    }

    // Sıralama
    let siraliUrunler = [...yeniFiltrelenmisUrunler];
    switch (siralama) {
      case 'fiyatArtan':
        siraliUrunler.sort((a, b) => a.fiyat - b.fiyat);
        break;
      case 'fiyatAzalan':
        siraliUrunler.sort((a, b) => b.fiyat - a.fiyat);
        break;
      case 'isimArtan':
        siraliUrunler.sort((a, b) => a.ad.localeCompare(b.ad));
        break;
      case 'isimAzalan':
        siraliUrunler.sort((a, b) => b.ad.localeCompare(a.ad));
        break;
      default:
        break;
    }
    setFiltrelenmisUrunler(siraliUrunler);
  }, [urunler, seciliYazar, seciliYayinevi, stoktaOlanlar, fiyatAralik, siralama]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        {kategoriBaslik}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {kategoriAciklama}
      </Typography>

      {/* Filtreleme ve Sıralama */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Yazar</InputLabel>
          <Select
            value={seciliYazar}
            label="Yazar"
            onChange={e => setSeciliYazar(e.target.value)}
          >
            <MenuItem value="">Tümü</MenuItem>
            {yazarlar.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Yayınevi</InputLabel>
          <Select
            value={seciliYayinevi}
            label="Yayınevi"
            onChange={e => setSeciliYayinevi(e.target.value)}
          >
            <MenuItem value="">Tümü</MenuItem>
            {yayinevleri.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sıralama</InputLabel>
          <Select
            value={siralama}
            label="Sıralama"
            onChange={e => setSiralama(e.target.value)}
          >
            <MenuItem value="fiyatArtan">Fiyat (Düşükten Yükseğe)</MenuItem>
            <MenuItem value="fiyatAzalan">Fiyat (Yüksekten Düşüğe)</MenuItem>
            <MenuItem value="isimArtan">İsim (A-Z)</MenuItem>
            <MenuItem value="isimAzalan">İsim (Z-A)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Min Fiyat"
          type="number"
          value={fiyatAralik.min}
          onChange={(e) => setFiyatAralik({ ...fiyatAralik, min: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">₺</InputAdornment>,
          }}
          sx={{ width: 120 }}
        />

        <TextField
          label="Max Fiyat"
          type="number"
          value={fiyatAralik.max}
          onChange={(e) => setFiyatAralik({ ...fiyatAralik, max: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">₺</InputAdornment>,
          }}
          sx={{ width: 120 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <input
            type="checkbox"
            id="stoktaOlanlar"
            checked={stoktaOlanlar}
            onChange={e => setStoktaOlanlar(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          <label htmlFor="stoktaOlanlar">Sadece stokta olanlar</label>
        </Box>


      </Box>

      {/* Ürün Listesi */}
      <Grid container spacing={4}>
        {filtrelenmisUrunler.map((urun) => (
          <Grid item key={urun.id} xs={12} sm={6} md={4} lg={3}>
            <UrunKarti urun={urun} handleClick={() => navigate(`/urun/${urun.id}`)} />
          </Grid>
        ))}
      </Grid>

      {filtrelenmisUrunler.length === 0 && (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          Bu kategoride ürün bulunamadı.
        </Typography>
      )}
    </Container>
  );
};

export default KategoriSayfasi;
