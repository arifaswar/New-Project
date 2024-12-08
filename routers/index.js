const router = require('express').Router();
const userRouter = require('./users');
const productRouter = require('./products');
const catRouter = require('./categories')

router.use(userRouter);
router.use(catRouter);
router.use('/products', productRouter)

module.exports = router