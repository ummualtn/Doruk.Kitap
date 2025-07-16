import User from './user.js';
import Book from './book.js';
import Cart from './cart.js';
import Favorite from './favorite.js';

// Cart ile Book ve User ilişkisi
Cart.belongsTo(Book, { foreignKey: 'bookId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Favorite ile Book ve User ilişkisi
Favorite.belongsTo(Book, { foreignKey: 'bookId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

export { User, Book, Cart, Favorite };
