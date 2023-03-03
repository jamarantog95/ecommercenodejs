const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user.model');



exports.protect = catchAsync(async (req, res, next) => {

    // OBTENER TOKEN Y COMPROBAR SI ESTA ALLI
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    // Si el token no existe || no se encuentra
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    // VERIFICACION DEL TOKEN
    const decoded = await promisify(jwt.verify)(
        token,
        process.env.SECRET_JWT_SEED
    );

    // VALIDAR EL USUARIO EXISTENTE
    const user = await User.findOne({
        where: {
            id: decoded.id,
            status: true,
        }
    })

    if (!user) {
        return next(new AppError('The owner of this token it not longer available', 401));
    }


    // Valldamos que exista esta propiedad
    if (user.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            user.passwordChangedAt.getTime() / 1000, 10
        );

        // Verificamos  que el tiempo en que se creo el token es menor al tiempo que se cambio la contraseña
        if (decoded.iat < changedTimeStamp) {
            return next(new AppError('User recently changed password, please login again', 401));
        }
    }
    // console.log(decoded.iat);
    // console.log(user.passwordChangedAt.getTime());

    req.sessionUser = user;
    next();
});


exports.protectAccountOwner = catchAsync(async (req, res, next) => {
    //Validamos el usuario y su session que obtenemos de las REQ
    const { user, sessionUser } = req;

    console.log(user.id, sessionUser.id);
    if (user.id !== sessionUser.id) {
        return next(new AppError('You do not own this account'))
    }

    next();
})


// VALIDAMOS LOS ROLES DE ACCESO
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.sessionUser.role)) {
            return next(
                new AppError('You do not have permission to perform this action!', 403)
            );
        }

        next();
    };
};