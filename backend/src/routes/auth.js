import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';
import { sendResetEmail } from '../utils/mailer.js';

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email ile zaten bir kullanıcı var.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    // Kayıt sonrası token üret
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(201).json({
      message: 'Kayıt başarılı!',
      token,
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err); // ← Bunu ekle!
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  console.log('LOGIN DEBUG - body:', req.body);
  const { email, password } = req.body;
  console.log('LOGIN DEBUG:', { email, password }); // EKLE
  try {
    const user = await User.findOne({ where: { email } });
    console.log('LOGIN DEBUG - user:', user);
    console.log('USER FOUND:', user); // EKLE
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Şifre yanlış.' });
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Giriş başarılı!', token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('LOGIN ERROR:', err); // <-- Bunu ekle!
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Şifremi unuttum
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 saat geçerli
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail(user.email, resetLink);
    res.json({ message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Şifre sıfırlama
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({ where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [User.sequelize.Op.gt]: new Date() }
    }});
    if (!user) return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Şifreniz başarıyla güncellendi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Oturum bilgisini döndür (kullanıcı + token)
import { authenticateToken } from '../middleware/authMiddleware.js';

router.get('/me', authenticateToken, async (req, res) => {
  try {
    // JWT'den gelen id ile kullanıcıyı veritabanından çek
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    res.json({ ...user.toJSON(), token: req.token });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

export default router;
