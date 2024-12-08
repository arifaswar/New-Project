const catController = require('../controllers/categoryController');

const router = require('express').Router();

router.post('/categories', catController.postCategory);
router.get('/categories', catController.getCategory)
module.exports = router