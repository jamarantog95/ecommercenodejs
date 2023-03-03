
const Cart = require('./cart.model');
const Category = require('./category.model');
const Order = require('./order.model');
const Product = require('./product.model');
const ProductImg = require('./productImg.model');
const ProductInCart = require('./productInCart.model');
const User = require('./user.model');

const initModel = () => {
    // Relaciones

    // 1 User <-----> N Product
    User.hasMany(Product) // 1 a muchos
    Product.belongsTo(User); // le pertenece a tabla origen

    // 1 User <-----> N Order
    User.hasMany(Order);
    Order.belongsTo(User);

    // 1 User <-----> 1 Cart
    User.hasOne(Cart);
    Cart.belongsTo(User);

    // 1 Product <-----> M ProductImg
    Product.hasMany(ProductImg);
    ProductImg.belongsTo(Product);

    /*1Category <--------> M Product*/
    Category.hasMany(Product);
    Product.belongsTo(Category);

    // 1 Cart <-----> M ProductsInCart
    Cart.hasMany(ProductInCart);
    ProductInCart.belongsTo(Cart);

    // 1 Product <-----> 1 ProductInCart
    Product.hasOne(ProductInCart);
    ProductInCart.belongsTo(Product);

    // 1 Cart <-----> 1 Order
    Cart.hasOne(Order);
    Order.belongsTo(Cart);

};

module.exports = initModel;