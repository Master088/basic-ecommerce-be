const { Cart, Product } = require('../models');

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.locals?.user?.id;

    const items = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.locals?.user?.id;
    const { productId, quantity = 1 } = req.body;

    const existingItem = await Cart.findOne({ where: { userId, productId } });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json(existingItem);
    }

    const cartItem = await Cart.create({ userId, productId, quantity });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.locals?.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({ where: { id, userId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.locals?.user?.id;
    const { id } = req.params;

    const deleted = await Cart.destroy({ where: { id, userId } });

    if (!deleted) return res.status(404).json({ error: 'Item not found' });

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};