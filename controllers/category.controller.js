const Category = require('../models/category.model');
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

exports.findAllCategories = catchAsync(async (req, res, next) => {

    // BUSCAMOS TODOS LAS CATEGORIAS CON STATUS TRUE
    const categories = await Category.findAll({
        attributes: ['id', 'name'],
        where: {
            status: true,
        },

        include: [{
            model: Product,
            attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
            where: {
                status: true,
            },
            //required: false, PARA QUE ME TRAIGA TODOS LAS CATEGORIAS SIN IMPORTAR QUE NO HALLAN PRODUCTOS
        }],
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'Categories fetched succesfuñly',
        //Enviamos todos las categorias
        categories

    });

});


exports.findCategory = catchAsync(async (req, res, next) => {

    // DESTRUCTURING DE LA REQ
    const { category } = req;

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The category was found successfully.',

        category

    });

});


exports.createCategory = catchAsync(async (req, res) => {

    // OBTENER INFORMACION  DEL REQ BODY
    const { name } = req.body;

    // CREAR UN NUEVA CATEGORIA
    const newCategory = await Category.create({
        name: name.toLowerCase(),
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The category was created. ',

        newCategory,

    });

});


exports.updateCategory = catchAsync(async (req, res, next) => {

    // DESTRUCTURING DE LA REQ
    const { category } = req;

    // OBTENER INFORMACION A ACTUALIZAR DEL REQ BODY
    const { name } = req.body;

    // BUSCAR EL PRODUCTO A ACTUALIZAR
    await category.update({ name });

    // SI NO EXISTE ENVIAMOS UN ERROR
    res.status(200).json({
        status: 'success',
        message: 'The category has been update successfully',
    });

});



exports.deleteCategory = catchAsync(async (req, res, next) => {

    // DESTRUCTURING DE LA REQ
    const { category } = req;

    // OBTENER INFORMACION A ACTUALIZAR DEL REQ BODY
    await category.update({
        status: false
    });
    // await product.destroy();

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The category has been disabled',
    });

});
