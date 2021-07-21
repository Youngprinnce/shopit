const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {initializePayment, verifyPayment} = require('../intrgrations/paystackClient')

// Process Payment  =>   /api/v1/payment/process
exports.processPayment =  catchAsyncErrors(async (req, res, next) => {

    const {amount, email} = req.body
    const form = {
        amount: amount * 100,
        email,
    }

    const {reference, confirmationUrl} = await initializePayment(form)

    res.status(200).json({
        success: true,
        reference, 
        confirmationUrl
    })
})


// Verify Payment  =>   /api/v1/payment/verify
exports.paymentVerify =  catchAsyncErrors(async (req, res, next) => {
    const ref = req.query.reference;

    const {metadata, amount, reference, status, message, paymentDate} = await verifyPayment(ref)

    res.status(200).json({
        success: true,
        metadata, 
        amount, 
        reference, 
        status, 
        message, 
        paymentDate
    })
})