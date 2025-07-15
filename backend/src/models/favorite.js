import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import User from './user.js';
import Book from './book.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id',
    },
  },
}, {
  tableName: 'favorites',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'bookId']
    }
  ]
});

export default Favorite;
