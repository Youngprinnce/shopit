const axios = require('axios');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const getHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
  'cache-control': 'no-cache'
});

const axiosInstance = axios.create({
  baseURL: process.env.PAYSTACK_PAYMENT_BASE_URL,
  headers: getHeaders(),
});

// eslint-disable-next-line consistent-return
exports.initializePayment = catchAsyncErrors( async (form) => {
    const response = await axiosInstance.post('/initialize', form);

    if (!response.data) {
      return next(new ErrorHandler('Error making payment', 404));
    }
    
    return {
      reference: response.data.data.reference,
      confirmationUrl: response.data.data.authorization_url,
    };
});

// eslint-disable-next-line consistent-return
exports.verifyPayment = catchAsyncErrors( async (ref) => {
    const response = await axiosInstance.get('/verify/'+ encodeURIComponent(ref));

    if (!response.data) {
      return next(new ErrorHandler('Error Verifying payment', 404));
    }

    const { reference, amount, status, metadata, paidAt, gateway_response } = response.data.data;

    return {
      metadata: metadata ? metadata: {},
      amount,
      reference,
      status,
      message: gateway_response,
      paymentDate: paidAt
    };
});
