import express from 'express';
import Book from '../models/book.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { connectRedis } from '../utils/redisClient.js';

const router = express.Router();

// Kitap ekle (korumalı)
router.post('/', authenticateToken, async (req, res) => {
  const {
    ad, yazar, aciklama, yayinevi, kategori, puan, stok, resimUrl,
    fiyat, id, isbn, sayfaSayisi, kategoriSlug // yeni alanlar eklendi
  } = req.body;
  try {
    const book = await Book.create({
      ad, yazar, aciklama, yayinevi, kategori, puan, stok, resimUrl,
      fiyat, id, isbn, sayfaSayisi, kategoriSlug // yeni alanlar eklendi
    });
    res.status(201).json({ message: 'Kitap eklendi!', book });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Tüm kitapları listele
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json({ books });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Tek kitap getir (Redis cache ile)
router.get('/:id', async (req, res) => {
  try {
    console.log("DETAY ENDPOINT: İstek geldi, id:", req.params.id);
    const redis = await connectRedis();
    const cacheKey = `book:${req.params.id}`;
    const cachedBook = await redis.get(cacheKey);
    console.log("DETAY ENDPOINT: Redis cache kontrol ediliyor:", cacheKey);
    if (cachedBook) {
      console.log("DETAY ENDPOINT: Redis'ten kitap bulundu:", cacheKey);
      return res.json(JSON.parse(cachedBook));
    }
    console.log("DETAY ENDPOINT: Redis'te yok, veritabanından çekiliyor:", cacheKey);
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      console.log("DETAY ENDPOINT: Kitap bulunamadı:", req.params.id);
      return res.status(404).json({ message: 'Kitap bulunamadı.' });
    }
    await redis.set(cacheKey, JSON.stringify(book), { EX: 60 * 10 }); // 10 dakika cache
    console.log("DETAY ENDPOINT: Kitap veritabanından çekildi ve Redis'e kaydedildi:", cacheKey);
    res.json(book);
  } catch (err) {
    console.error("DETAY ENDPOINT: Hata oluştu:", err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Kitap güncelle (korumalı)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Kitap bulunamadı.' });
    // Frontend ile uyumlu tüm alanları güncelle
    const { ad, yazar, aciklama, yayinevi, kategori, puan, stok, resimUrl, fiyat, isbn, sayfaSayisi, kategoriSlug } = req.body;
    await book.update({ ad, yazar, aciklama, yayinevi, kategori, puan, stok, resimUrl, fiyat, isbn, sayfaSayisi, kategoriSlug });
    res.json({ message: 'Kitap güncellendi!', book });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Kitap sil (korumalı)
import { Cart, Favorite } from '../models/index.js';

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Kitap bulunamadı.' });

    // Önce sepetlerden ve favorilerden bu kitabı sil
    await Cart.destroy({ where: { bookId: req.params.id } });
    await Favorite.destroy({ where: { bookId: req.params.id } });

    await book.destroy();
    res.json({ message: 'Kitap silindi.' });
  } catch (err) {
    console.error('BOOK DELETE ERROR:', err); // Hata detaylı log
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

export default router;
