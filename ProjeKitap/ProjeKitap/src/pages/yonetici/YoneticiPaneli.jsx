import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { selectTumUrunler, urunSilAsync, fetchUrunlerAsync } from '../../store/slices/urunlerSlice';
import UrunEkle from './UrunEkle';
import UrunDuzenle from './UrunDuzenle';

import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const YoneticiPaneli = () => {
  // Kullanıcı yönetimi için state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  // Hook'lar ve state'ler en başta
  const currentUser = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const urunler = useSelector(selectTumUrunler);
  const navigate = useNavigate();

  // Tab ve dialog state'leri
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUrun, setSelectedUrun] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urunToDelete, setUrunToDelete] = useState(null);

  // Sipariş yönetimi için state
  const [siparisler, setSiparisler] = useState([]);

  // Kullanıcıları çek
  useEffect(() => {
    if (activeTab === 2) {
      const fetchUsers = async () => {
        setUsersLoading(true);
        setUsersError('');
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Kullanıcılar alınamadı.');
          const data = await res.json();
          setUsers(data);
        } catch (err) {
          setUsersError(err.message || 'Kullanıcılar alınırken hata oluştu.');
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);
  const [siparisLoading, setSiparisLoading] = useState(false);
  const [siparisError, setSiparisError] = useState('');
  const [siparisSilDialogOpen, setSiparisSilDialogOpen] = useState(false);
  const [siparisToDelete, setSiparisToDelete] = useState(null);

  useEffect(() => {
    // Eğer kullanıcı yoksa veya admin değilse giriş sayfasına yönlendir
    if (authStatus === 'succeeded' && (!currentUser || !currentUser.isAdmin)) {
      navigate('/giris');
    }
  }, [currentUser, authStatus, navigate]);

  useEffect(() => {
    dispatch(fetchUrunlerAsync());
  }, [dispatch]);

  // Siparişleri çek (sadece Sipariş Yönetimi sekmesi aktifken)
  useEffect(() => {
    if (activeTab === 1) {
      const fetchSiparisler = async () => {
        setSiparisLoading(true);
        setSiparisError('');
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Siparişler alınamadı.');
          const data = await res.json();
          setSiparisler(data.orders || data);
        } catch (err) {
          setSiparisError(err.message || 'Siparişler alınırken hata oluştu.');
        } finally {
          setSiparisLoading(false);
        }
      };
      fetchSiparisler();
    }
  }, [activeTab]);


  // Sipariş silme
  const handleSiparisSil = (siparis) => {
    setSiparisToDelete(siparis);
    setSiparisSilDialogOpen(true);
  };
  const confirmSiparisDelete = async () => {
    if (siparisToDelete) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${siparisToDelete.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Sipariş silinemedi!');
        setSiparisler((prev) => prev.filter(s => s.id !== siparisToDelete.id));
        setSiparisSilDialogOpen(false);
        setSiparisToDelete(null);
      } catch (err) {
        alert(err.message || 'Sipariş silinirken hata oluştu.');
      }
    }
  };

  // Sipariş yönetimi render fonksiyonu
  const renderSiparisYonetimi = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Tüm Siparişler</Typography>
      {siparisLoading ? (
        <Typography>Yükleniyor...</Typography>
      ) : siparisError ? (
        <Typography color="error">{siparisError}</Typography>
      ) : siparisler.length === 0 ? (
        <Typography>Hiç sipariş yok.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Ürün</TableCell>
                <TableCell>Adet</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {siparisler.map((siparis) => (
                <TableRow key={siparis.id}>
                  <TableCell>{siparis.user?.name || '-'}</TableCell>
                  <TableCell>{siparis.book?.ad || '-'}</TableCell>
                  <TableCell>{siparis.quantity || '-'}</TableCell>
                  <TableCell>{siparis.createdAt ? new Date(siparis.createdAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{typeof siparis.status === 'number' ? ['Alındı','Onaylandı','Hazırlanıyor','Kargoya Verildi','Teslim Edildi'][siparis.status] : '-'}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleSiparisSil(siparis)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={siparisSilDialogOpen}
        onClose={() => setSiparisSilDialogOpen(false)}
      >
        <DialogTitle>Sipariş Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSiparisSilDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmSiparisDelete} color="error" variant="contained">Sil</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderUrunYonetimi = () => (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Ürün Listesi</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleUrunEkle}
        >
          Yeni Ürün Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urunler.map((urun) => (
              <TableRow key={urun.id}>
                <TableCell>{urun.ad}</TableCell>
                <TableCell>{urun.kategori}</TableCell>
                <TableCell>{urun.fiyat} TL</TableCell>
                <TableCell>{urun.stok}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleUrunDuzenle(urun)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleUrunSil(urun)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UrunEkle
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

    <UrunDuzenle
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      urun={selectedUrun}
    />

    <Dialog
      open={deleteDialogOpen}
      onClose={() => setDeleteDialogOpen(false)}
    >
      <DialogTitle>Ürün Silme Onayı</DialogTitle>
      <DialogContent>
        <DialogContentText>
          "{urunToDelete?.ad}" adlı ürünü silmek istediğinizden emin misiniz?
          Bu işlem geri alınamaz.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
        <Button onClick={confirmDelete} color="error" variant="contained">Sil</Button>
      </DialogActions>
    </Dialog>
  </Box>
);

const handleUrunSil = (urun) => {
  setUrunToDelete(urun);
  setDeleteDialogOpen(true);
};

const renderKullaniciYonetimi = () => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Kullanıcı Yönetimi</Typography>
    {usersLoading ? (
      <Typography>Yükleniyor...</Typography>
    ) : usersError ? (
      <Typography color="error">{usersError}</Typography>
    ) : users.length === 0 ? (
      <Typography>Hiç kullanıcı yok.</Typography>
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin mi?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? 'Evet' : 'Hayır'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
);

// Tab değiştirme fonksiyonu
const handleTabChange = (event, newValue) => setActiveTab(newValue);

// Ürün ekle fonksiyonu
const handleUrunEkle = () => setDialogOpen(true);

// Ürün düzenle fonksiyonu
const handleUrunDuzenle = (urun) => {
  setSelectedUrun(urun);
  setEditDialogOpen(true);
};

// Ürün silme onay fonksiyonu
const confirmDelete = async () => {
  if (urunToDelete) {
    await dispatch(urunSilAsync(urunToDelete.id));
    dispatch(fetchUrunlerAsync());
    setDeleteDialogOpen(false);
    setUrunToDelete(null);
  }
};

return (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" gutterBottom>
      Yönetici Paneli
    </Typography>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Ürün Yönetimi" />
        <Tab label="Sipariş Yönetimi" />
        <Tab label="Kullanıcı Yönetimi" />
      </Tabs>
    </Box>
    {activeTab === 0 && renderUrunYonetimi()}
    {activeTab === 1 && renderSiparisYonetimi()}
    {activeTab === 2 && renderKullaniciYonetimi()}
  </Container>
);
};

export default YoneticiPaneli;
