const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, login, revalidateToken } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middlewares");
const { validIfExistUserEmail } = require("../middlewares/user.middlewares");
const { validateFields } = require("../middlewares/validatefield.middlewares");
const { upload } = require("../utils/multer");

const router = Router();

router.post('/signup', [
    // upload.single('profileImageUrl'),
    // isEmpty: Valida que no este vacio
    check('username', 'The username must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    // isEmail: Valida que este en formato de correo electronico
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),

    validateFields,
    validIfExistUserEmail,
], createUser);


router.post('/login', [
    // isEmpty: Valida que no este vacio
    check('email', 'The email must be mandatory').not().isEmpty(),
    // isEmail: Valida que este en formato de correo electronico
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    validateFields,
], login)


router.use(protect);

router.get('/renew', revalidateToken);

module.exports = {
    authRouter: router,
};