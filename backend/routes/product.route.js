const express = require('express')
const router = express.Router();

const { getProducts, newProduct } = require('../controllers/product.controller')

router.get('/products', getProducts);
router.getProducts('/products/new', newProduct);

module.exports = router;