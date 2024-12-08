const { Product, User } = require("../models");
class productController {
  static async postProduct(req, res, next) {
    try {
      // res.json('add product')
      const { name, description, stock, price, imageUrl, categoryId } = req.body;
      // console.log(req.user);
      const UserId = req.user.id;
      const newProduct = await Product.create({
        name,
        description,
        stock,
        price,
        imageUrl,
        categoryId,
        userId: UserId,
      });
      res.status(201).json({
        status: "Successfully to add new product",
        newProduct,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const Products = await Product.findAll({
        include: [
          {
            model: User,
            attributes: {
                exclude: 'password'
            }
          },
        ],
      });
      res.status(201).json({
        status: "Successfully to get products",
        Products,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static async editProduct(req, res, next) {
    try {
      const { name, description, stock, price, imageUrl, categoryId } = req.body;
      const {id} = req.params
      const UserId = req.user.id;
      const product = await Product.findByPk(id);
    //   console.log(product);
    if(!product){
        throw({name: 'ProductNotFound'})
    }
      const updateProduct = await product.update({name, description, stock, price, imageUrl, categoryId, userId:UserId})
      res.status(200).json({
        status: "Successfully to update product",
        updateProduct,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  static async deleteProduct(req, res, next) {
    try {
      const {id} = req.params
      const product = await Product.findByPk(id);
    if(!product){
        throw({name: 'ProductNotFound'})
    }
      await product.destroy()
      res.status(200).json({
        status: "Successfully to delete product",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = productController;
