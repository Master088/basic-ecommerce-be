const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const {checkAccessToken} = require('../middlewares/auth.middleware')

router.post('/', checkAccessToken,categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', checkAccessToken,categoryController.getCategory);
router.put('/:id',checkAccessToken, categoryController.updateCategory);
router.delete('/:id',checkAccessToken, categoryController.deleteCategory);

module.exports = router;