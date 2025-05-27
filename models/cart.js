module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    tableName: 'carts',
  });

  Cart.associate = models => {
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Cart.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return Cart;
};
