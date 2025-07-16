import express from 'express';
import Order from '../models/order.js';
import { sendOrderCreated } from '../utils/rabbitmq.js';
import Book from '../models/book.js';
import User from '../models/user.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sipariş oluştur (korumalı)
router.post('/', authenticateToken, async (req, res) => {
  const { bookId, quantity } = req.body;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Kitap bulunamadı.' });
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'Geçersiz adet.' });
    }
    if (book.stok === null || book.stok < quantity) {
      return res.status(400).json({ message: 'Yeterli stok yok.' });
    }

    // Sipariş oluştur
    const order = await Order.create({
      bookId,
      userId: req.user.id,
      quantity: quantity || 1,
      status: 'pending',
    });

    // Stoktan düş
    book.stok = Math.max(0, book.stok - quantity);
    await book.save();

    // RabbitMQ'ya sipariş mesajı gönder
    await sendOrderCreated({
      orderId: order.id,
      userId: req.user.id,
      bookId,
      quantity: quantity || 1,
      createdAt: order.createdAt
    });
    res.status(201).json({ message: 'Sipariş oluşturuldu!', order });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Siparişleri getir (admin ise tümünü, değilse kendi siparişlerini)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let orders;
    if (req.user.isAdmin) {
      orders = await Order.findAll({
        include: [
          { model: Book, as: 'book' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
        ],
        order: [['createdAt', 'DESC']],
      });
    } else {
      orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{ model: Book, as: 'book' }],
        order: [['createdAt', 'DESC']],
      });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Tek sipariş getir (korumalı)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Book, as: 'book' }],
    });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Sipariş güncelle (korumalı)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı.' });
    const { quantity, status } = req.body;
    await order.update({ quantity, status });
    res.json({ message: 'Sipariş güncellendi!', order });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Sipariş sil (korumalı)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı.' });
    await order.destroy();
    res.json({ message: 'Sipariş silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

export default router;
