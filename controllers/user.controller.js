
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const ProductInCart = require('../models/productInCart.model');

exports.findAllUsers = catchAsync(async (req, res, next) => {

    // BUSCAMOS TODOS LOS USUARIOS CON STATUS TRUE
    const users = await User.findAll({
        where: {
            status: true,
        }
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The users has been show',
        //Enviamos todos los usuarios
        users

    });

});


exports.findUser = catchAsync(async (req, res, next) => {
    // DESTRUCTURING DE LA REQ
    const { user } = req;

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The user  was found successfully.',
        //Enviamos el USUARIO a consultar
        user
    });

});


exports.updateUser = catchAsync(async (req, res, next) => {
    // DESTRUCTURING DE LA REQ
    const { user } = req;

    // OBTENER INFORMACION A ACTUALIZAR DEL REQ BODY
    const { username, email } = req.body;

    // BUSCAR EL USUARIO A ACTUALIZAR
    const updateUser = await user.update({
        username,
        email,
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    res.status(200).json({
        status: 'success',
        message: 'The user has been update successfully',

        updateUser,

    });

});


exports.deleteUser = catchAsync(async (req, res, next) => {
    // DESTRUCTURING DE LA REQ
    const { user } = req;

    // OBTENER INFORMACION A ACTUALIZAR DEL REQ BODY
    await user.update({
        status: false
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The user has been disabled',
    });

});


exports.updatePassword = catchAsync(async (req, res, next) => {
    // DESTRUCTURING DE LA REQ
    const { user } = req;

    // OBTENER INFORMACION  DEL REQ BODY
    const { currentPassword, newPassword } = req.body;

    // COMPARA LA CONTRASEÑA INGRESADA POR TECLADO VS LA CONTRASEÑA ALMACENADA EN BD
    if (!(await bcrypt.compare(currentPassword, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // ENCRIPTAR LA CONTRASEÑA
    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(newPassword, salt);

    // OBTENER INFORMACION A ACTUALIZAR PASSWORD && LA FECHA DE CAMBIO CONTRASEÑA
    await user.update({
        password: encriptedPassword,
        passwordChangedAt: new Date(),
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The user password was updated successfully',
    });
})


exports.getOrders = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    // Buscamos todas las ordenes
    const orders = await Order.findAll({
        where: {
            userId: sessionUser.id,
            status: true,
        },
        include: [
            {
                model: Cart,
                where: {
                    status: 'purchased',
                },
                include: [
                    {
                        model: ProductInCart,
                        where: {
                            status: 'purchased',
                        },
                    },
                ],
            },
        ],
    });

    res.status(200).json({
        orders,
    });
});


exports.getOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { sessionUser } = req;
    //TODO: acordarme de hacer esta mejora o esta refactorización
    const order = await Order.findOne({
        where: {
            userId: sessionUser.id,
            id,
            status: true,
        },
        include: [
            {
                model: Cart,
                where: {
                    status: 'purchased',
                },
                include: [
                    {
                        model: ProductInCart,
                        where: {
                            status: 'purchased',
                        },
                    },
                ],
            },
        ],
    });
    res.status(200).json({
        order,
    });
});