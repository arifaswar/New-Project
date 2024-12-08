const userController = require('../controllers/userController');

const router = require('express').Router();

router.post('/register', userController.postRegister );
router.post('/login', userController.postLogin)

module.exports = router