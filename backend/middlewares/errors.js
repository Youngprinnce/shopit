const ErrorHandler = require('../utils/errorHandler');
module.exports = (err, req, res, next) => {
    // PRODUCTION MODE
    // let error = { ...err }

    // //Wrong Mongoose Object ID Error
    // if(err.name == 'CastError'){
    //     const message = `Resource not found. Invalid: ${err.path}`
    //     error = new ErrorHandler(message, 400)
    // }

    // //Handle Mongoose Validation Error
    // if(err.name == 'ValidationError'){
    //     const message = Object.values(err.values).map(value => value.message);
    //     error = new ErrorHandler(message, 400)
    // }

    // error.message = err.message;
    // res.status(error.statusCode || 500).json({
    //     success: false,
    //     message: error.message || 'Internal Server Error'
    // })


    //DEVELOPMENT MODE
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        success: false,
        err,
        message: err.message,
        stack: err.stack,
    })

}