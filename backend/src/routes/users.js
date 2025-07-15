import express from 'express';
import User from '../models/user.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tüm kullanıcıları getir (sadece admin için)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Yetkisiz.' });
    }
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı.', error: err.message });
  }
});

export default router;
