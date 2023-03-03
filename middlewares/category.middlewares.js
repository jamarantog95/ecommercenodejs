const Category = require("../models/category.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.validCategoryById = catchAsync(async (req, res, next) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { id } = req.params;

    // BUSCAR EL CATEGORIA DE FORMA INDIVIDUAL
    const category = await Category.findOne({
        where: {
            // id:id,
            id,
            status: true
        },
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    req.category = category;
    next();


});