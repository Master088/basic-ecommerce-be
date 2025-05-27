const router = require("express").Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload");
 const {checkAccessToken} = require('../middlewares/auth.middleware')


router.post("/", checkAccessToken, upload.single("image"), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.put("/:id", checkAccessToken, upload.single("image"), productController.updateProduct);
router.delete("/:id", checkAccessToken, productController.deleteProduct);

module.exports = router;
