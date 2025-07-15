import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';

const categories = [
  { id: 1, name: 'Ana Sınıfı Kitapları', image: 'path_to_image' },
  { id: 2, name: 'İlk Okul Kitapları', image: 'path_to_image' },
  { id: 3, name: 'Okul Öncesi Kitapları', image: 'path_to_image' },
  { id: 4, name: 'Orta Okul Kitapları', image: 'path_to_image' },
  { id: 5, name: 'Hobi Oyunları', image: 'path_to_image' },
  { id: 6, name: 'Okuma Kitapları', image: 'path_to_image' },
  { id: 7, name: 'Deneme Sınavları', image: 'path_to_image' },
  { id: 8, name: 'Sözlükler Ansiklopedi', image: 'path_to_image' },
];

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Kategoriler
      </Typography>
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={category.image}
                alt={category.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {category.name}
                </Typography>
                <Button variant="contained" color="primary" fullWidth>
                  İncele
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Öne Çıkan Kitaplar
        </Typography>
        {/* Featured books section will be added here */}
      </Box>
    </Container>
  );
};

export default Home;
