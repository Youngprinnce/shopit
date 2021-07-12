const express = require('express');
const app = express();


const cookieParser = require('cookie-parser')

// const dotenv = require('dotenv');
const path = require('path')

const errorMiddleware = require('./middlewares/errors')

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Import all routes
const products = require('./routes/product.route');
const auth = require('./routes/auth.route');

app.use('/api/v1', products)
app.use('/api/v1', auth)

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app