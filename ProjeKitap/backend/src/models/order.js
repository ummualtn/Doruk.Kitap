import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import User from './user.js';
import Book from './book.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'orders',
});

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

export default Order;
