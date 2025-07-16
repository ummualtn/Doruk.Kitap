import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUrunlerAsync } from '../../store/slices/urunlerSlice';
import {
  Container,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import UrunKarti from '../../components/urun/UrunKarti';
import { setSearchQuery, setSearchResults, selectSearchQuery, selectSearchResults } from '../../store/slices/searchSlice';
import { selectTumUrunler } from '../../store/slices/urunlerSlice';

const AramaSonuclari = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlQuery = params.get('query') || '';
  const tumUrunler = useSelector(selectTumUrunler);
  const query = useSelector(selectSearchQuery);
  const results = useSelector(selectSearchResults);

  // Ürünler yüklenmemişse otomatik olarak yükle
  useEffect(() => {
    if (tumUrunler.length === 0) {
      dispatch(fetchUrunlerAsync());
    }
    // eslint-disable-next-line
  }, [tumUrunler, dispatch]);

  // Ürünler yüklendikten sonra arama işlemini yap
  useEffect(() => {
    if (tumUrunler.length === 0) return; // Ürünler yüklenmeden arama yapma
    if (urlQuery) {
      const filtered = tumUrunler.filter(urun =>
        urun.ad.toLowerCase().includes(urlQuery.toLowerCase()) ||
        urun.yazar.toLowerCase().includes(urlQuery.toLowerCase()) ||
        urun.kategori.toLowerCase().includes(urlQuery.toLowerCase())
      );
      dispatch(setSearchQuery(urlQuery));
      dispatch(setSearchResults(filtered));
    } else {
      dispatch(setSearchQuery(''));
      dispatch(setSearchResults([]));
    }
    // eslint-disable-next-line
  }, [urlQuery, tumUrunler, dispatch]);

  if (tumUrunler.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Ürünler yükleniyor...
        </Typography>
      </Container>
    );
  }

  if (!query) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Lütfen bir arama yapın
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        "{query}" için arama sonuçları ({results.length})
      </Typography>

      {results.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Sonuç bulunamadı
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {results.map((urun) => (
            <Grid item key={urun.id} xs={12} sm={6} md={4} lg={3}>
              <UrunKarti urun={urun} handleClick={() => navigate(`/urun/${urun.id}`)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AramaSonuclari;
