const { verifyToken } = require("../helpers/jwt");
const {User} =require('../models')
const authentication = async(req, res, next) => {
    try {
        // console.log(req.headers.authorization);
        const bearerToken = req.headers.authorization
        if(!bearerToken){
            throw({name:'JsonWebTokenError'})
        }
        const token = bearerToken.split(' ')[1];
        if(!token){
            throw({name:'JsonWebTokenError'})
        };
        const verified = verifyToken(token);
        // console.log(verified);
        const user = await User.findByPk(verified.id)
        // console.log(user);
        if(!user){
            throw({name:'JsonWebTokenError'})
        };
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
}
module.exports = authentication