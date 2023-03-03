const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.validIfExistUser = catchAsync(async (req, res, next) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { id } = req.params;

    // BUSCAR EL USUARIO DE FORMA INDIVIDUAL
    const user = await User.findOne({
        where: {
            // id:id,
            id,
            status: true
        },
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    req.user = user;
    next();

});


exports.validIfExistUserEmail = catchAsync(async (req, res, next) => {

    // 1. OBTENEMOS ID DE LA REQ BODY
    const { email } = req.body;

    // 3. BUSCAR EL USUARIO INDIVIDUAL
    const user = await User.findOne({
        where: {
            // id:id,
            email: email.toLowerCase(),
        },
    });

    if (user && !user.status) {
        // LO QUE SE DBERIA HACER ES UN UPDATE A TRUE AL ESTADO DE LA CUENTA
        return next(new AppError('The user has an account, but it is deactivated, please contact the administrator.', 400));
    }

    if (user) {
        return next(new AppError('The email user already exists.', 400));
    }

    next();

});