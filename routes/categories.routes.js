// RUTAS : puntos de entrada de la aplicacion

// importa express validator
const { check } = require("express-validator");
const { Router } = require("express");

const { findAllCategories, findCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");
const { protect, restrictTo } = require("../middlewares/auth.middlewares");
const { validateFields } = require("../middlewares/validatefield.middlewares");
const { validCategoryById } = require("../middlewares/category.middlewares");
const router = Router();


// Ruta para encontrar todos los productos
router.get('/', findAllCategories);

router.get('/:id', validCategoryById, findCategory);

// Protejo las rutas posteriores
router.use(protect);

router.post('/', [
    // isEmpty: Valida que no este vacio
    check('name', 'The name is required').not().isEmpty(),

    validateFields,
    restrictTo('admin')
], createCategory);


router.patch('/:id', [
    // isEmpty: Valida que no este vacio
    check('name', 'The name is required').not().isEmpty(),

    validateFields,
    validCategoryById,
    restrictTo('admin'),
    //protectAccountOwner
], updateCategory);


router.delete('/:id',
    validCategoryById,
    restrictTo('admin'),
    //protectAccountOwner,
    deleteCategory);


module.exports = {
    categoryRouter: router,
}