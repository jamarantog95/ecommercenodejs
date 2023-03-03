
const { Router } = require("express");
const { check } = require("express-validator");
const { addProductToCart, updateCart, removeProductToCart, buyProductOnCart } = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middlewares");
const { validExistCart, validExistProductInCart, validExistProductInCartForUpdate, validExistProductInCartByParamsForUpdate } = require("../middlewares/cart.middlewares");
const { validBodyProductById, validIfExistProductsInStock, validExistProductIdByParams, validExistProductInStockForUpdate } = require("../middlewares/products.middlewares");
const { validateFields } = require("../middlewares/validatefield.middlewares");
const router = Router();


router.use(protect);

router.post('/add-product', [
    check('productId', 'The productId is required').not().isEmpty(),
    check('productId', 'The productId is required').isNumeric(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),

    validateFields,
    validBodyProductById,
    validIfExistProductsInStock,
    validExistCart,
    validExistProductInCart
], addProductToCart);


router.patch('/update-cart', [
    check('productId', 'The productId is required').not().isEmpty(),
    check('productId', 'The productId is required').isNumeric(),
    check('newQty', 'The quantity is required').not().isEmpty(),
    check('newQty', 'The quantity must be a number').isNumeric(),

    validateFields,
    validBodyProductById,
    validExistProductInStockForUpdate,
    validExistProductInCartForUpdate
], updateCart);


router.delete('/:productId', validExistProductIdByParams, validExistProductInCartByParamsForUpdate, removeProductToCart);


router.post('/purchase', buyProductOnCart);

module.exports = {
    cartRouter: router,
}