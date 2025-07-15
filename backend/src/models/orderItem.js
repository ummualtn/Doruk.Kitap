import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import Order from './order.js';
import Book from './book.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orders', key: 'id' },
    onDelete: 'CASCADE',
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'books', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
  tableName: 'order_items',
});

OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

export default OrderItem;
