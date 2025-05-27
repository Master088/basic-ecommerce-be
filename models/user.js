'use strict';
const bcrypt = require('bcryptjs');
const { saltOrRounds } = require('../config/app.config');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'  
    }
  }, {});

  // Hash password before saving
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(saltOrRounds);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Instance method to validate password
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  // Associations
  User.associate = function(models) {
    User.hasMany(models.RefreshToken, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders',
    });
  };

  return User;
};
