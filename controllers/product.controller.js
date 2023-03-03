
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

exports.findAllProducts = catchAsync(async (req, res) => {

    // BUSCAMOS TODOS LOS PRODUCTOS CON STATUS TRUE
    const products = await Product.findAll({
        where: {
            status: true,
        }
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The products has been show.',
        //Enviamos todos los productos
        products

    });

});


exports.findProduct = catchAsync(async (req, res) => {

    // DESTRUCTURING DE LA REQ
    const { product } = req;

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The product was found successfully.',
        //Enviamos el producto a consultar
        product
    });

});


exports.createProduct = catchAsync(async (req, res) => {

    // OBTENER INFORMACION  DEL REQ BODY
    const { title, description, quantity, price, categoryId, userId } = req.body;

    // CREAR UN NUEVO PRODUCTO
    const newProduct = await Product.create({
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        quantity,
        price,
        categoryId,
        userId,
    });

    // RESPUESTA DEL SERVIDOR
    res.status(201).json({
        status: 'success',
        message: 'The product was created. ',

        newProduct,

    });

});


exports.updateProduct = catchAsync(async (req, res) => {

    // DESTRUCTURING DE LA REQ
    const { product } = req;

    // OBTENER INFORMACION A ACTUALIZAR DEL REQ BODY
    const { title, description, quantity, price } = req.body;

    // BUSCAR EL PRODUCTO A ACTUALIZAR
    const updateProduct = await product.update({
        title,
        description,
        quantity,
        price,
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    res.status(200).json({
        status: 'success',
        message: 'The product has been update successfully',

        updateProduct,

    });

});


exports.deleteProduct = catchAsync(async (req, res) => {

    // DESTRUCTURING DE LA REQ
    const { product } = req;

    // OBTENER INFORMACION A ACTUALIZAR DEL REQ BODY
    await product.update({
        status: false
    });
    // await product.destroy();

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The product has been disabled',
    });

});
