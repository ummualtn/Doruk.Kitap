import express from 'express';
import ContactMessage from '../models/contactMessage.js';

const router = express.Router();

// Tüm iletişim mesajlarını getir
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Mesajlar alınamadı.', error: err.message });
  }
});

// İletişim mesajı gönder
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Ad, e-posta ve mesaj zorunludur.' });
  }
  try {
    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: 'Mesajınız başarıyla kaydedildi.', contact });
  } catch (err) {
    res.status(500).json({ message: 'Mesaj kaydedilemedi.', error: err.message });
  }
});

export default router;
