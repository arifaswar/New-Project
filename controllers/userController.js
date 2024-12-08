const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const {User} = require('../models')
class userController {
    static async postRegister(req, res, next){
        try {
            // res.json('register')
            const {name, email, password, role, numberPhone, address} = req.body
            const newUser = await User.create({name, email, password, role, numberPhone, address});
            res.status(201).json({
                status: 'Successfully to add user',
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    };

    static async postLogin(req, res, next){
        try {
            // res.json('register')
            const {email, password, role} = req.body;

            if(!email){
                throw({name: 'EmailRequired'})
            }
            if(!password){
                throw({name: 'PasswordRequired'})
            }
            if(!role){
                throw({name: 'RoleRequired'})
            }
            const user = await User.findOne({where: {email}});
            if(!user){
                throw({name:"UserNotFound"})
            };

            const isValidPassword = comparePassword(password, user.password);
            // console.log(isValidPassword);
            if(!isValidPassword){
                throw({name: 'PasswordInvalid'})
            };
            const access_token = signToken({id:user.id});
            // console.log(access_token);
            res.status(200).json({
                status: 'Successfully to Login',
                access_token: access_token
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}
module.exports = userController