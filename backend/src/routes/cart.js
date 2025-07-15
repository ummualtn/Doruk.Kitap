import express from 'express';
import { Cart } from '../models/index.js';
import Book from '../models/book.js';
import { Op } from 'sequelize';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sepeti getir (kullanıcıya özel)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // JWT'den alınacak
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [Book],
    });
    console.log('[CART][GET] userId:', userId, 'cartItems:', cartItems.map(i => ({id: i.bookId, quantity: i.quantity})));
    res.json(cartItems);
  } catch (err) {
    console.error('CART GET ERROR:', err);
    res.status(500).json({ error: err.message || 'Sepet alınamadı.' });
  }
});

// Sepete ürün ekle veya miktar güncelle
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Kitap bulunamadı.' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Geçersiz adet.' });
    }
    let item = await Cart.findOne({ where: { userId, bookId } });
    let newQuantity = quantity;
    if (item) {
      newQuantity = item.quantity + quantity;
      if (book.stok !== null && newQuantity > book.stok) {
        return res.status(400).json({ error: `Stok yetersiz. Maksimum eklenebilecek adet: ${book.stok - item.quantity}` });
      }
      item.quantity = newQuantity;
      await item.save();
      console.log('[CART][POST][UPDATE] userId:', userId, 'bookId:', bookId, 'quantity:', item.quantity);
      return res.json(item);
    }
    if (book.stok !== null && quantity > book.stok) {
      return res.status(400).json({ error: `Stok yetersiz. Maksimum eklenebilecek adet: ${book.stok}` });
    }
    item = await Cart.create({ userId, bookId, quantity });
    console.log('[CART][POST][CREATE] userId:', userId, 'bookId:', bookId, 'quantity:', quantity);
    res.status(201).json(item);
  } catch (err) {
    console.error('CART POST ERROR:', err);
    res.status(500).json({ error: err.message || 'Sepete ekleme başarısız.' });
  }
});

// Sepetten ürün çıkar
router.delete('/:bookId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;
    await Cart.destroy({ where: { userId, bookId } });
    res.json({ success: true });
  } catch (err) {
    console.error('CART DELETE ERROR:', err);
    res.status(500).json({ error: err.message || 'Sepetten çıkarma başarısız.' });
  }
});

// Sepeti tamamen temizle
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.destroy({ where: { userId } });
    res.json({ success: true });
  } catch (err) {
    console.error('CART CLEAR ERROR:', err);
    res.status(500).json({ error: err.message || 'Sepeti temizleme başarısız.' });
  }
});

export default router;
