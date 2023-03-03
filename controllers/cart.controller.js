const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const ProductInCart = require("../models/productInCart.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.addProductToCart = catchAsync(async (req, res, next) => {

    const { productId, quantity } = req.body;
    const { cart } = req;

    // AGREGA UN NUEVO PRODUCTO AL CARRITO
    const productInCart = await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity,
    })

    res.status(201).json({
        status: 'success',
        message: 'Product successfully added',

        productInCart,
    });

});


exports.updateCart = catchAsync(async (req, res, next) => {
    // Obtenemos la nueva cantidad a actualizar
    const { newQty } = req.body;
    // Obtenemos el producto en el carrito
    const { productInCart } = req;

    // SI LA CANTIDAD ES MENOR A CERO
    if (newQty < 0) {
        return next(new AppError('The quantity must be greater than 0', 400));
    }

    // SI LA CANTIDAD ES IGUAL A CERO
    if (newQty === 0) {
        await productInCart.update({ quantity: newQty, status: 'removed' }); // SE REMUEVE EL PRODUCTO DEL CARRITO
    } else {
        await productInCart.update({ quantity: newQty, status: 'active' });
    }

    res.status(200).json({
        status: 'success',
        message: 'The product in cart has been updated',
    });
});


exports.removeProductToCart = catchAsync(async (req, res, next) => {
    const { productInCart } = req;

    await productInCart.update({ quantity: 0, status: 'removed' });

    res.status(200).json({
        status: 'success',
        message: 'The product in cart has been removed',
    });
});


exports.buyProductOnCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    // BUSCAR EL CARRITO DEL USUARIO
    const cart = await Cart.findOne({
        attributes: ['id', 'userId'],
        where: {
            userId: sessionUser.id,
            status: 'active',
        },
        include: [
            {
                model: ProductInCart,
                // attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: {
                    status: 'active',
                },
                include: [
                    {
                        model: Product,
                        attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                    },
                ],
            },
        ],
    });

    // VALIDAMOS SI EL CARRITO EXISTE
    if (!cart) {
        return next(new AppError('There are not products in cart', 400));
    }


    // CALCULAR EL PRECIO TOTAL A PAGAR
    let totalPrice = 0;

    cart.productInCarts.forEach(productInCart => {
        // Calculamos la cantidad por el precio
        totalPrice += productInCart.quantity * productInCart.product.price;
    });

    // ACTUALIZAMOS EL STOCK O CANTIDAD DEL PRODUCTO
    const purchasedProductPromises = cart.productInCarts.map(
        async productInCart => {
            // Buscar el producto para actualizar su información
            const product = await Product.findOne({
                where: {
                    id: productInCart.productId,
                },
            });

            // Definimos el nuevo stock : cantidad inicial producto  - cantidad del carrito
            const newStock = product.quantity - productInCart.quantity;

            // Se actualiza el stock del producto
            return await product.update({
                quantity: newStock
            });
        }
    );
    await Promise.all(purchasedProductPromises);


    // CREAMOS CONSTANTE PARA RECORRER EL ARREGLO PRODUCTINCARTS
    const statusProductInCartPromises = cart.productInCarts.map(
        async productInCart => {
            // Buscar el producto en el carrito y que esten activos para actualizar su información
            const productInCartFoundIt = await ProductInCart.findOne({
                where: {
                    id: productInCart.id,
                    status: 'active',
                },
            });
            // Una ves encontrado actualizamos los productos del carrito y su estado a purchased
            return await productInCartFoundIt.update({
                status: 'purchased'
            });
        }
    );
    await Promise.all(statusProductInCartPromises);

    // Actualizamos el estado del CARRITO
    await cart.update({
        status: 'purchased'
    });

    // Procedemos a crear la ORDEN
    const order = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice,
    });

    res.status(201).json({
        message: 'The order has been generated succesfully',
        order,
    });

});