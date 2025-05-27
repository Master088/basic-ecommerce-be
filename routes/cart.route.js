const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const { checkAccessToken } = require("../middlewares/auth.middleware");

router.get("/",checkAccessToken, cartController.getCartItems);
router.post("/", checkAccessToken,cartController.addToCart);
router.put("/:id",checkAccessToken, cartController.updateCartItem);
router.delete("/:id",checkAccessToken, cartController.removeCartItem);

module.exports = router;
