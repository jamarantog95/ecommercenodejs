// RUTAS : puntos de entrada de la aplicacion

// importa express validator
const { Router } = require("express");
const { check } = require("express-validator");

const { findAllUsers, findUser, updateUser, deleteUser, updatePassword, getOrders, getOrder } = require("../controllers/user.controller");
const { protectAccountOwner, protect } = require("../middlewares/auth.middlewares");
const { validIfExistUser } = require("../middlewares/user.middlewares");
const { validateFields } = require("../middlewares/validatefield.middlewares");
const router = Router();


// Esta ruta me va a encontrar todos los usuarios
router.get('/', findAllUsers);


router.get('/orders', protect, getOrders);

router.get('/orders/:id', protect, getOrder);


router.get('/:id', validIfExistUser, findUser);


router.patch('/:id', [
    // isEmpty: Valida que no este vacio
    check('username', 'The username must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    // isEmail: Valida que este en formato de correo electronico
    check('email', 'The email must be a correct format').isEmail(),

    validateFields,
    validIfExistUser,
], updateUser);


router.patch('/password/:id', [
    // isEmpty: Valida que no este vacio
    check('currentPassword', 'The current password must be mandatory').not().isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),

    validateFields,
    validIfExistUser,
    protectAccountOwner,
], updatePassword);


router.delete('/:id', validIfExistUser, deleteUser);


module.exports = {
    userRouter: router,
}