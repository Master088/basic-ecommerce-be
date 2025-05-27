const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { checkAccessToken } = require('../middlewares/auth.middleware');

router.post('/', checkAccessToken, orderController.placeOrder);
router.get('/', checkAccessToken, orderController.getOrders);
router.get('/:id', checkAccessToken, orderController.getOrder);
router.put('/:id', checkAccessToken, orderController.updateOrder);
router.put('/:id/status/:status', checkAccessToken, orderController.updateOrderStatus);

module.exports = router;
