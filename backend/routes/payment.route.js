const express = require('express')
const router = express.Router();

const { processPayment, paymentVerify } = require('../controllers/payment.controller');

router.post('/payment/process', processPayment);
router.get('/payment/verify', paymentVerify );


module.exports = router;