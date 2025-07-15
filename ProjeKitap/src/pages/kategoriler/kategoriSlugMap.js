// Kategori adından slug'a çeviren yardımcı fonksiyon
const kategoriIsimdenSlug = {
  'Ana Sınıfı Kitapları': 'ana-sinif',
  'İlkokul Kitapları': 'ilkokul',
  'Okul Öncesi Kitapları': 'okul-oncesi',
  'Ortaokul Kitapları': 'ortaokul',
  'Hobi Oyunları': 'hobi-oyunlari',
  'Okuma Kitapları': 'okuma-kitaplari',
  'Deneme Sınavları': 'deneme-sinavlari',
  'Sözlükler ve Ansiklopediler': 'sozlukler-ansiklopedi',
  // Eski formlarda "İlk Okul" veya "Orta Okul" gibi yazımlar olabilir diye alternatifler
  'İlk Okul Kitapları': 'ilkokul',
  'Orta Okul Kitapları': 'ortaokul',
};

export default kategoriIsimdenSlug;
