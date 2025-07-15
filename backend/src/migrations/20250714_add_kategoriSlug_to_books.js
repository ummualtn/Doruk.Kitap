// Migration: kitaplara kategoriSlug alanı ekle

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('books', 'kategoriSlug', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('books', 'kategoriSlug');
}
