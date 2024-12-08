const productController = require('../controllers/productController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization')
const router = require('express').Router();

router.use(authentication)
router.get('/', productController.getProducts);
router.use(authorization)
router.post('/', productController.postProduct);
router.put('/:id', productController.editProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router