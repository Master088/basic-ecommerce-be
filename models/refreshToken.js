'use strict';
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true, // null means active, non-null means revoked
    }
  }, {});

  RefreshToken.associate = function(models) {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return RefreshToken;
};
