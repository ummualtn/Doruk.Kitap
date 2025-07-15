import Book from '../src/models/book.js';
import sequelize from '../src/sequelize.js';

const slugMap = {
  'Okuma Kitapları': 'okuma-kitaplari',
  'İlk Okul Kitapları': 'ilkokul',
  'İlkokul Kitapları': 'ilkokul',
  'Ana Sınıfı Kitapları': 'ana-sinif',
  'Okul Öncesi Kitapları': 'okul-oncesi',
  'Orta Okul Kitapları': 'ortaokul',
  'Ortaokul Kitapları': 'ortaokul',
  'Hobi Oyunları': 'hobi-oyunlari',
  'Deneme Sınavları': 'deneme-sinavlari',
  'Sözlükler ve Ansiklopediler': 'sozlukler-ansiklopedi',
};

(async () => {
  await sequelize.sync();
  const books = await Book.findAll();
  for (const book of books) {
    const slug = slugMap[book.kategori] || '';
    if (slug && book.kategoriSlug !== slug) {
      book.kategoriSlug = slug;
      await book.save();
      console.log(`${book.ad} -> ${slug}`);
    }
  }
  process.exit();
})();
