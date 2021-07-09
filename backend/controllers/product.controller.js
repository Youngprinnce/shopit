const Product = require('../models/product');

//Create new product => /api/v1/product/new
exports.getProducts = async (req, res, next) => {

    res.status(201).json({
        success: true,
        message: 'All product'
    });
}

//Create new product => /api/v1/product/new
exports.newProduct = async (req, res, next) => { 

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
}