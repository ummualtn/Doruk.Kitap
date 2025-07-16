import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './sequelize.js';
import { startOrderConsumer } from './utils/rabbitmq.js';
import User from './models/user.js';
import Book from './models/book.js';
import Order from './models/order.js';
import OrderItem from './models/orderItem.js';
import ContactMessage from './models/contactMessage.js';
import { Cart } from './models/index.js';
import { Favorite } from './models/index.js';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import ordersRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import favoriteRoutes from './routes/favorite.js';
import contactRoutes from './routes/contact.js';
import usersRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);
// Books routes
app.use('/api/books', booksRoutes);
// Orders routes
app.use('/api/orders', ordersRoutes);
// Cart routes
app.use('/api/cart', cartRoutes);
// Favorite routes
app.use('/api/favorite', favoriteRoutes);
// Contact routes
app.use('/api/contact', contactRoutes);
// Users routes
app.use('/api/users', usersRoutes);

// Test DB connection & sync models
sequelize.authenticate()
  .then(async () => {
    console.log('PostgreSQL bağlantısı başarılı!');
    // Tabloları otomatik güncelle (veri kaybı olmadan)
    await User.sync({ alter: true });
    await Book.sync({ alter: true });
    await Order.sync({ alter: true });
    await OrderItem.sync({ alter: true });
    await ContactMessage.sync({ alter: true });
    await Cart.sync({ alter: true });
    await Favorite.sync({ alter: true });
    console.log('Tüm ana tablolar güncellendi.');
  })
  .catch(err => console.error('Veritabanı bağlantı hatası:', err));

// Basit test endpoint'i
app.get('/', (req, res) => {
  res.send('Backend API çalışıyor!');
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
  // RabbitMQ consumer başlat
  startOrderConsumer().catch(err => console.error('RabbitMQ consumer başlatılamadı:', err));
});
