import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import tema from './tema';
import Header from './components/layout/Header';
import Anasayfa from './pages/Anasayfa';
import ResetPassword from './pages/auth/ResetPassword';
import Giris from './pages/auth/Giris';
import Kayit from './pages/auth/Kayit';
import SifremiUnuttum from './pages/auth/SifremiUnuttum';
import UrunDetay from './pages/urun/UrunDetay';
import Sepetim from './pages/sepet/Sepetim';
import Favorilerim from './pages/favoriler/Favorilerim';
import Hesabim from './pages/hesap/Hesabim';
import YoneticiPaneli from './pages/yonetici/YoneticiPaneli';
import SiparisOzeti from './pages/siparis/SiparisOzeti';
import Siparislerim from './pages/siparis/Siparislerim';
import SiparisDurumu from './pages/siparis/SiparisDurumu';
import Odeme from './pages/odeme/Odeme';
import Iletisim from './pages/iletisim/Iletisim';
import AramaSonuclari from './pages/arama/AramaSonuclari';
import KategoriSayfasiWrapper from './components/kategori/KategoriSayfasiWrapper';
import IletisimMesajlari from './pages/admin/IletisimMesajlari';
import AdminRoute from './components/routes/AdminRoute';

// Kategori sayfaları

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeAsync } from './store/slices/authSlice';
import { fetchCartAsync } from './store/slices/cartSlice';
import { fetchFavoritesAsync } from './store/slices/favoritesSlice';

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchMeAsync());
    }
  }, [dispatch]);

  // auth.user değiştiğinde sepet ve favorileri backend'den yükle
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth && auth.user) {
      dispatch(fetchCartAsync());
      dispatch(fetchFavoritesAsync());
    }
  }, [dispatch, auth.user]);

  if (authStatus === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  return (
    <ThemeProvider theme={tema}>
      <Router>
        <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Anasayfa />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/giris" element={<Giris />} />
              <Route path="/kayit" element={<Kayit />} />
              <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
              <Route path="/urun/:id" element={<UrunDetay />} />
              <Route path="/sepetim" element={<Sepetim />} />
              <Route path="/favorilerim" element={<Favorilerim />} />
              <Route path="/hesabim" element={<Hesabim />} />
              <Route path="/yonetici" element={<YoneticiPaneli />} />
              <Route path="/siparis-ozeti" element={<SiparisOzeti />} />
              <Route path="/siparis-durumu" element={<SiparisDurumu />} />
              <Route path="/odeme" element={<Odeme />} />
              <Route path="/arama" element={<AramaSonuclari />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/siparislerim" element={<Siparislerim />} />

              {/* Dinamik Kategori Route'u */}
              <Route path="/kategori/:kategoriSlug" element={<KategoriSayfasiWrapper />} />
              <Route path="/admin/iletisim-mesajlari" element={
  <AdminRoute>
    <IletisimMesajlari />
  </AdminRoute>
} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
  );
}

export default App;
