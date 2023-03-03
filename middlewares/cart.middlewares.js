const Cart = require("../models/cart.model");
const ProductInCart = require("../models/productInCart.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.validExistCart = catchAsync(async (req, res, next) => {

    const { sessionUser } = req;

    // BUSCAR EL CARRITO DE FORMA INDIVIDUAL
    let cart = await Cart.findOne({
        where: {
            userId: sessionUser.id,
            status: 'active'
        }
    })

    // VALIDAMOS SI EXISTE DICHO CARRITO
    if (!cart) {
        cart = await Cart.create({ userId: sessionUser.id });
    }

    req.cart = cart;
    next();

});


exports.validExistProductInCart = catchAsync(async (req, res, next) => {
    //Obtenemos el producto y el carito
    const { product, cart } = req;

    // Busca un producto en el carrito
    const productInCart = await ProductInCart.findOne({
        where: {
            cartId: cart.id,
            productId: product.id,
        },
    });

    // Si existe un producto en el carrito con Status removed procedemos a actualizar su status a activo
    if (productInCart && productInCart.status === 'removed') {
        await productInCart.update({ status: 'active', quantity: 1 });

        return res.status(200).json({
            status: 'success',
            message: 'Product successfully added',
        });
    }

    // Si el producto existe
    if (productInCart) {
        return next(new AppError('This product already exists in the cart', 400));
    }

    req.productInCart = productInCart;
    next();

});



// VALIDA SI EXISTE PRODUCTO EN EL CARRITO PARA ACTUALIZAR
exports.validExistProductInCartForUpdate = catchAsync(async (req, res, next) => {

    //Obtenemos la session de usuario de la REQ
    const { sessionUser } = req;
    // Obtenemos el id del producto
    const { productId } = req.body;


    // OBTENEMOS EL CARRITO  CON EL ID DE LA SESION SI ESTA ACTIVO
    const cart = await Cart.findOne({
        where: {
            userId: sessionUser.id,
            status: 'active'
        }
    })

    // OBTENEMOS EL PRODUCTO QUE ESTA DENTRO DEL CARRITO
    const productInCart = await ProductInCart.findOne({
        where: {
            cartId: cart.id,
            productId,
        },
    });


    // BUSCAMOS SI NO EXISTE NINGUN PRODUCTO EN EL CARRITO
    if (!productInCart) {
        return next(new AppError('The product does not exist in the cart', 400));
    }

    req.productInCart = productInCart;

    next();

});



exports.validExistProductInCartByParamsForUpdate = catchAsync(async (req, res, next) => {
    //Obtenemos la session de usuario de la REQ
    const { sessionUser } = req;
    // Obtenemos el id producto del REQ PARAMS
    const { productId } = req.params;

    // Buscamos el carrito que este activo
    const cart = await Cart.findOne({
        where: {
            userId: sessionUser.id,
            status: 'active',
        },
    });

    // OBTENEMOS EL PRODUCTO ACTIVO QUE ESTA DENTRO DEL CARRITO
    const productInCart = await ProductInCart.findOne({
        where: {
            cartId: cart.id,
            productId,
            status: 'active',
        },
    });

    // BUSCAMOS SI NO EXISTE NINGUN PRODUCTO EN EL CARRITO
    if (!productInCart) {
        return next(new AppError('The product does not exist in the cart', 400));
    }

    req.productInCart = productInCart;

    next();
});

