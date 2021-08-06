const express = require('express');
const app = express();
const fileUpload = require('express-fileupload')
const cors = require('cors')

const cookieParser = require('cookie-parser')

const errorMiddleware = require('./middlewares/errors')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload())
app.use(cors())


// Import all routes
const products = require('./routes/product.route');
const auth = require('./routes/auth.route');
const order = require('./routes/order.route');
const payment = require('./routes/payment.route');

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)
app.use('/api/v1', payment)


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app