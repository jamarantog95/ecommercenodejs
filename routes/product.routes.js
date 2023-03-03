// RUTAS : puntos de entrada de la aplicacion

// importa express validator
const { check } = require("express-validator");
const { Router } = require("express");

const { findProduct, createProduct, updateProduct, deleteProduct, findAllProducts } = require("../controllers/product.controller");
const { protect, restrictTo } = require("../middlewares/auth.middlewares");
const { validProductById } = require("../middlewares/products.middlewares");
const { validateFields } = require("../middlewares/validatefield.middlewares");
const router = Router();


// Esta ruta me va a encontrar todos los productos, esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama findAllProducts
router.get('/', findAllProducts);

// Esta ruta me va a encontrar un un producto dado un id, este id se lo especifico
// por el path es decir por los parametros de la url, esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama findProduct
router.get('/:id', validProductById, findProduct);


router.use(protect);

// Esta ruta me va a crear un un producto ,esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama createProduct
router.post('/', [
    // isEmpty: Valida que no este vacio
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('price', 'The price is required').not().isEmpty(),

    validateFields,
    restrictTo('admin'),
], createProduct);

// Esta ruta me va a actualizar un un producto dado un id, este id se lo especifico
// por el path es decir por los parametros de la url, esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama updateProduct
router.patch('/:id', [
    // isEmpty: Valida que no este vacio
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('price', 'The price is required').not().isEmpty(),

    validateFields,
    validProductById,
    restrictTo('admin'),
], updateProduct);

// Esta ruta me va a deshabilitar un un producto dado un id, este id se lo especifico
// por el path es decir por los parametros de la url, esta ruta viene
// del archivo servidor que tiene un path product y este ruta se dirige hacia
// el controlador de productos que se llama deleteProduct
router.delete('/:id', validProductById, deleteProduct);


module.exports = {
    productRouter: router,
}