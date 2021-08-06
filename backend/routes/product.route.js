const express = require('express')
const router = express.Router();

const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct,
    deleteProduct, 
    createProductReview,
    getProductReviews,
    deleteProductReview,
    getAdminProducts
} = require('../controllers/product.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);
router.get('/admin/products', getAdminProducts);
router.get('/product/:id', getSingleProduct);
router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.put('/review', isAuthenticatedUser,  createProductReview);
router.get('/reviews', isAuthenticatedUser,  getProductReviews);
router.delete('/reviews', isAuthenticatedUser,   deleteProductReview);

module.exports = router;