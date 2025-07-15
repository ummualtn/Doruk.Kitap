import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Hesabim = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Container>
      <Typography variant="h4">Hesabım</Typography>
      {user ? (
        <Box mt={3}>
          <Typography>Ad: {user.name}</Typography>
          {user.soyad && <Typography>Soyad: {user.soyad}</Typography>}
          {user.surname && !user.soyad && <Typography>Soyad: {user.surname}</Typography>}
          <Typography>E-posta: {user.email}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/siparislerim" 
            sx={{ mt: 3 }}
          >
            Siparişlerim
          </Button>
        </Box>
      ) : (
        <Typography mt={3}>Kullanıcı bilgisi bulunamadı.</Typography>
      )}
    </Container>
  );
};

export default Hesabim;
