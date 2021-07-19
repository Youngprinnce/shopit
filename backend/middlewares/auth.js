
const User = require('../models/user')
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

//Checks if user is authenticated or not 
exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next)=>{
    const {token} = req.cookies
    console.log(token)
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjVjMjkzZDAzZjk5MTA2NDJjYTlkZiIsImlhdCI6MTYyNjcxOTI1OSwiZXhwIjoxNjI3MzI0MDU5fQ.d_Pz3xemlCMjAQEjAsUfgm52J7S6uXJAVreSnPDOLeg'
    

    if(!token){
        return next(new ErrorHandler('Login first to access this resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
})

exports.authorizeRoles = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
        }
        next()
    }
} 
    