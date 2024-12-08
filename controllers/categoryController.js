const {Category} = require('../models')
class catController {
    static async postCategory (req, res, next) {
        try {
            const {name} = req.body
            const newCat = await Category.create({name});
            res.status(201).json({
                status: 'Successfully add category',
                newCat
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    };

    static async getCategory (req, res, next) {
        try {
            const cat = await Category.findAll();
            res.status(200).json({
                status: 'Successfully get all category',
                categories: cat
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
};
module.exports = catController