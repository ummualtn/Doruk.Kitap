import express from 'express';
import { Favorite } from '../models/index.js';
import Book from '../models/book.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Kullanıcının favorilerini getir
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [Book],
    });
    console.log('[FAVORITE][GET] userId:', userId, 'favorites:', favorites.map(i => ({id: i.bookId})));
    res.json(favorites);
  } catch (err) {
    console.error('FAVORITE GET ERROR:', err);
    res.status(500).json({ error: err.message || 'Favoriler alınamadı.' });
  }
});

// Favoriye ekle
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;
    if (!bookId) {
      console.log('[FAVORITE][POST][ERROR] Eksik bookId:', req.body);
      return res.status(400).json({ error: 'Eksik bookId' });
    }
    // Debug: log full request body and user info
    console.log('[FAVORITE][POST][REQUEST_BODY]', req.body);
    console.log('[FAVORITE][POST][USER]', userId, '| bookId:', bookId);
    // Log current favorite count for user before creation
    const beforeCount = await Favorite.count({ where: { userId } });
    console.log(`[FAVORITE][POST][BEFORE] userId: ${userId} | favoriteCount: ${beforeCount}`);

    let item = await Favorite.findOne({ where: { userId, bookId } });
    if (!item) {
      await Favorite.create({ userId, bookId });
      console.log('[FAVORITE][POST][CREATE] userId:', userId, 'bookId:', bookId);
    } else {
      console.log('[FAVORITE][POST][EXISTS] userId:', userId, 'bookId:', bookId);
    }
    // Log current favorite count for user after creation
    const afterCount = await Favorite.count({ where: { userId } });
    console.log(`[FAVORITE][POST][AFTER] userId: ${userId} | favoriteCount: ${afterCount}`);
    // Her durumda ilişkili Book ile birlikte favoriyi döndür
    item = await Favorite.findOne({ where: { userId, bookId }, include: [Book] });
    res.status(201).json(item);
  } catch (err) {
    console.error('FAVORITE POST ERROR:', err);
    res.status(500).json({ error: err.message || 'Favoriye ekleme başarısız.' });
  }
});

// Tüm favorileri sil
router.delete('/clear/all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await Favorite.destroy({ where: { userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Favoriler silinemedi.' });
  }
});

// Favoriden çıkar
router.delete('/:bookId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;
    await Favorite.destroy({ where: { userId, bookId } });
    res.json({ success: true });
  } catch (err) {
    console.error('FAVORITE DELETE ERROR:', err);
    res.status(500).json({ error: err.message || 'Favoriden çıkarma başarısız.' });
  }
});

export default router;
