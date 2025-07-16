import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Paper,
  Divider,
  IconButton,
  useTheme,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import { fetchUrunlerAsync, selectTumUrunler } from '../store/slices/urunlerSlice';
import { useSelector, useDispatch } from 'react-redux';
import UrunKarti from '../components/urun/UrunKarti';

const kategoriler = [
  {
    id: 'ana-sinif',
    isim: 'Ana Sınıfı Kitapları',
    resim: '/kategoriler/ana-sinifi-kitaplari.svg',
    aciklama: 'Ana sınıfı öğrencileri için özel hazırlanmış eğitici kitaplar',
  },
  {
    id: 'ilkokul',
    isim: 'İlk Okul Kitapları',
    resim: '/kategoriler/ilk-okul-kitaplari.svg',
    aciklama: 'İlkokul müfredatına uygun ders ve yardımcı kitaplar',
  },
  {
    id: 'okul-oncesi',
    isim: 'Okul Öncesi Kitapları',
    resim: '/kategoriler/okul-oncesi-kitaplari.svg',
    aciklama: 'Okul öncesi çocukların gelişimini destekleyen kitaplar',
  },
  {
    id: 'ortaokul',
    isim: 'Orta Okul Kitapları',
    resim: '/kategoriler/orta-okul-kitaplari.svg',
    aciklama: 'Ortaokul öğrencileri için ders ve test kitapları',
  },
  {
    id: 'hobi-oyunlari',
    isim: 'Hobi Oyunları',
    resim: '/kategoriler/hobi-oyunlari.svg',
    aciklama: 'Eğlenceli ve eğitici hobi oyunları',
  },
  {
    id: 'okuma-kitaplari',
    isim: 'Okuma Kitapları',
    resim: '/kategoriler/okuma-kitaplari.svg',
    aciklama: 'Her yaş grubu için okuma kitapları',
  },
  {
    id: 'deneme-sinavlari',
    isim: 'Deneme Sınavları',
    resim: '/kategoriler/deneme-sinavlari.svg',
    aciklama: 'Tüm sınav türleri için deneme sınavları',
  },
  {
    id: 'sozlukler-ansiklopedi',
    isim: 'Sözlükler ve Ansiklopediler',
    resim: '/kategoriler/sozlukler-ansiklopediler.svg',
    aciklama: 'Kapsamlı sözlükler ve ansiklopediler',
  },
];


const KategoriKarti = ({ kategori }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={kategori.resim}
        alt={kategori.isim}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {kategori.isim}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {kategori.aciklama}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate(`/kategori/${kategori.id}`)}
        >
          İncele
        </Button>
      </Box>
    </Card>
  );
};

const Anasayfa = () => {
  const dispatch = useDispatch();
  const urunler = useSelector(selectTumUrunler);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUrunlerAsync());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
          color: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'url(/kategoriler/hero-pattern.svg) repeat',
            opacity: 0.1,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 2
            }}
          >
            Kitaplarla Dolu
            <br />
            Bir Dünyaya
            <br />
            Hoş Geldiniz!
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              maxWidth: '600px',
              lineHeight: 1.6,
              opacity: 0.9
            }}
          >
            Eğitim ve öğrenme yolculuğunuzda size rehberlik edecek binlerce kitap burada.
            Hayallerinize giden yolda size eşlik etmekten mutluluk duyuyoruz.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ 
                px: 3, 
                py: 1.25,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c51162 30%, #f50057 90%)',
                }
              }}
            >
              Keşfetmeye Başla
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                px: 3, 
                py: 1.25,
                fontSize: '1rem',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Kategorileri İncele
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Kategoriler */}
      <Typography variant="h4" gutterBottom>
        Kategoriler
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {kategoriler.map((kategori) => (
          <Grid item xs={12} sm={6} md={3} key={kategori.id}>
            <KategoriKarti kategori={kategori} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 6 }} />

      {/* Çok Satan Kitaplar */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Çok Satan Kitaplar
        </Typography>
        <Grid container spacing={3}>
          {urunler.slice(0, 4).map((kitap) => (
            <Grid item xs={12} sm={6} md={3} key={kitap.id}>
              <UrunKarti urun={kitap} handleClick={() => navigate(`/urun/${kitap.id}`)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Yeni Çıkan Kitaplar */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Yeni Çıkan Kitaplar
        </Typography>
        <Grid container spacing={3}>
          {urunler.slice(4, 8).map((kitap) => (
            <Grid item xs={12} sm={6} md={3} key={kitap.id}>
              <UrunKarti urun={kitap} handleClick={() => navigate(`/urun/${kitap.id}`)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Tüm Ürünler */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Tüm Ürünler
        </Typography>
        <Grid container spacing={3}>
          {urunler.map((kitap) => (
            <Grid item xs={12} sm={6} md={3} key={kitap.id}>
              <UrunKarti urun={kitap} handleClick={() => navigate(`/urun/${kitap.id}`)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      
    </Container>
  );
};

export default Anasayfa;
