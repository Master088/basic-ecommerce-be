const { Order, OrderItem, Product } = require('../models');

// Place a new order
exports.placeOrder = async (req, res) => {
 
  const userId = req.locals?.user?.id;
  const { customerName, customerEmail, customerAddress, items } = req.body;
 
  try {
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

   

    const order = await Order.create({ 
      userId, 
      customerName, 
      customerEmail, 
      customerAddress,
      totalAmount,
      status: 'pending'
    });

    const orderItems = items.map(item => ({
      ...item,
      orderId: order.id
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ order, items: orderItems });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all orders of the current user
exports.getOrders = async (req, res) => {
  const userId = req.locals?.user?.id;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',             // alias for order items in Order model
          include: [
            {
              model: Product,
              as: 'product',        // alias for product in OrderItem model
              attributes: ['image'] // only get image field from product
            }
          ]
        }
      ]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single order by ID for the current user
exports.getOrder = async (req, res) => {
  const userId = req.locals?.user?.id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: { model: OrderItem, as: 'items' }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order details (except status)
exports.updateOrder = async (req, res) => {
  const userId = req.locals?.user?.id;
  const orderId = req.params.id;
  const { customerName, customerEmail, customerAddress, items } = req.body;

  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: { model: OrderItem, as: 'items' }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (['completed', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: `Cannot update a ${order.status} order` });
    }

    // Update basic info
    order.customerName = customerName || order.customerName;
    order.customerEmail = customerEmail || order.customerEmail;
    order.customerAddress = customerAddress || order.customerAddress;

    // Handle items
    if (items && Array.isArray(items)) {
      await OrderItem.destroy({ where: { orderId } });

      const newItems = items.map(item => ({ ...item, orderId }));
      await OrderItem.bulkCreate(newItems);

      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      order.totalAmount = totalAmount;
    }

    await order.save();

    const updatedOrder = await Order.findOne({
      where: { id: orderId, userId },
      include: { model: OrderItem, as: 'items' }
    });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status dynamically via params
exports.updateOrderStatus = async (req, res) => {
  const userId = req.locals?.user?.id;
  const orderId = req.params.id;
  const newStatus = req.params.status.toLowerCase();

  const validStatuses = ['pending', 'processing','completed', 'cancelled'];

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'completed' && newStatus !== 'cancelled') {
      return res.status(400).json({ error: 'Cannot change status of a completed order except to cancelled' });
    }

    if (order.status === newStatus) {
      return res.status(400).json({ error: `Order status is already '${newStatus}'` });
    }

    order.status = newStatus;
    await order.save();

    res.json({ message: `Order status updated to '${newStatus}'`, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
