const express = require('express')
const router = express.Router();

const { newOrder, 
    getSingleOrder, 
    myOrders, 
    allOrders, 
    updateOrder, 
    deleteOrder } = require('../controllers/order.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);
router.get('/admin/orders', isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrder);
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;