
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/jwt");
const AppError = require("../utils/appError");

exports.createUser = catchAsync(async (req, res) => {

    // console.log(req.body);
    // console.log(req.file);

    // res.json({
    //     status: 'success',
    // })

    // OBTENER INFORMACION  DEL REQ BODY
    const { username, email, password, role = 'user' } = req.body;

    // CREAR UNA INSTANCIA DE LA CLASE USER
    const user = new User({ username, email, password, role });

    // ENCRIPTAR LA CONTRASEÑA
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // GUARDAR EN LA BD CON LAS CONTRASEÑAS ENCRIPTADAS
    await user.save();

    // GENERAR EL JWT
    const token = await generateJWT(user.id);

    // RESPUESTA DEL SERVIDOR
    res.status(201).json({
        status: 'success',
        message: 'User created succesfully',

        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        }
    });

});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // REVISAR SI EL USUARIO EXISTE && LA CONTRASEÑA ES CORRECTA
    const user = await User.findOne({
        where: {
            email: email.toLowerCase(),
            status: true,
        }
    });

    //Valida si el usuario esta activo
    if (!user) {
        return next(new AppError('The user could not be found', 404));
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }


    // SI TODO ESTA OK, ENVIAR UN TOKEN AL CLIENTE
    const token = await generateJWT(user.id);

    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    })
});


exports.revalidateToken = catchAsync(async (req, res, next) => {

    const { id } = req.sessionUser;

    const token = await generateJWT(id);

    const user = await User.findOne({
        where: {
            status: true,
            id,
        },
    });

    return res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });


});