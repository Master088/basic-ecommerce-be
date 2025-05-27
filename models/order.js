'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      customerName: { type: DataTypes.STRING, allowNull: false },
      customerEmail: { type: DataTypes.STRING, allowNull: false },
      customerAddress: { type: DataTypes.TEXT, allowNull: false },
      status: {  
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      totalAmount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0,}
    },
    {
      tableName: 'orders',
    }
  );

  Order.associate = models => {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };

  return Order;
};
