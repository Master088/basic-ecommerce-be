'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discountedPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      description: {type: DataTypes.TEXT, allowNull: true,},
      stock: {type: DataTypes.INTEGER,allowNull: false,defaultValue: 0,},
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'products',
    }
  );

  Product.associate = models => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  };

  return Product;
};
