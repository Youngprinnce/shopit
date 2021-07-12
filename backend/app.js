const express = require('express');
const app = express();

// const dotenv = require('dotenv');
const path = require('path')

const errorMiddleware = require('./middlewares/errors')

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import all routes
const products = require('./routes/product.route');

app.use('/api/v1', products)


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app