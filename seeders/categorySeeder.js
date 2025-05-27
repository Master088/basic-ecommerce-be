'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'categories',
      [
        { name: 'T-Shirt', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Jacket', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Shirt', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Jeans', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Bag', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Shoes', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Watches', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Cap', createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
