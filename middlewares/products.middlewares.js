const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.validProductById = catchAsync(async (req, res, next) => {
    // OBTENEMOS ID DE LA REQ PARAMS
    const { id } = req.params;

    // BUSCAR EL PRODUCTO DE FORMA INDIVIDUAL
    const product = await Product.findOne({
        where: {
            // id:id,
            id,
            status: true,
        },
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    req.product = product;
    next();

});


// Validar si existe el producto a agregar 
exports.validBodyProductById = catchAsync(async (req, res, next) => {

    const { productId } = req.body;

    // BUSCAR EL PRODUCTO DE FORMA INDIVIDUAL
    const product = await Product.findOne({
        where: {
            id: productId,
            status: true,
        },
    })

    // SI NO EXISTE ENVIAMOS UN ERROR
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    req.product = product;
    next();
})


// Validar si el producto tiene stock
exports.validIfExistProductsInStock = catchAsync(async (req, res, next) => {
    const { product } = req;
    const { quantity } = req.body;


    if (product.quantity < quantity) {
        return next(new AppError('There are not enaough products in the stock', 400));
    }

    next();
})


// VALIDA SI EXISTE PRODUCTO EN STOCK
exports.validExistProductInStockForUpdate = catchAsync(async (req, res, next) => {

    const { product } = req;
    //Nueva Cantidad
    const { newQty } = req.body;

    // Si la Nueva Cantidad que se va actualizar es mayor que el stock
    if (newQty > product.quantity) {
        return next(
            new AppError('There are not enaugh products in the stock', 400)
        );
    }

    next();

})


// Validar si el Producto existe por Parametros
exports.validExistProductIdByParams = catchAsync(async (req, res, next) => {
    // Obtenemos el id del producto del REQ PARAMS
    const { productId } = req.params;

    // BUSCAMOS QUE EL PRODUCTO ESTE ACTIVO
    const product = await Product.findOne({
        where: {
            id: productId,
            status: true
        }
    })

    // SI EL PRODUCTO NO EXISTE
    if (!product) {
        return next(new AppError('Product not found', 404))
    }

    next();
});