const {Product, User} = require('../models')
const authorization = async(req, res, next) => {
    try {
        const UserId = req.user.role;
        // console.log(UserId)
        if(UserId !== 'Seller'){
            throw({name: 'Forbidden'})
        }else {
            next()
        }
        
    } catch (error) {
        console.log(error);
        next(error)
    }
};
module.exports = authorization