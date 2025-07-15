import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yazar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  yayinevi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  puan: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  resimUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fiyat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sayfaSayisi: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kategoriSlug: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'books',
});

export default Book;