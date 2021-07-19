const User = require('../models/user');
const cloudinary = require('cloudinary')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')

resolve = require('path').resolve

//Register a user  => /api/v1/register
exports.registerUser = catchAsyncErrors(async(req,res,next) =>{

    const imageId = function () {
        return Math.random().toString(36).substr(2, 4);
    };

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, { public_id: `uploads/images${imageId()}` });

    const {name, email, password } =req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
})


//Login user  => /api/v1/login
exports.loginUser = catchAsyncErrors(async(req,res,next) =>{
    const {email, password } = req.body;

    //Checks if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 404))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalid Email or password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or password', 401));
    }

    sendToken(user, 200, res)
})

//Logout user  => /api/v1/logout
exports.logout = catchAsyncErrors(async(req,res,next) =>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    //Creat reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow: \n ${resetUrl} \n \n if you have not requested this email, then ignore it`

    try {

        await sendEmail(user.email, `ShopIT Password Recovery`, message)

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req,res,next) =>{
    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('password reset token is invalid or has expired'))
    }

    if(req.body.password !== req.body.confirmpassword){
        return next(new ErrorHandler('Password does not match', 400))
    }

    //Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 200, res)

})

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

// Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incoreect', 400))
    }

    user.password = req.body.password
    await user.save()

    sendToken(user, 200, res)
})

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async(req,res,next) =>{
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.body.avatar !== ''){

        const user = await User.findById(req.user.id)

        const imageId = function () {
            return Math.random().toString(36).substr(2, 4);
        };

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id)

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, { public_id: `uploads/images${imageId()}` });

        newUserData.avatar = {
            public_id :result.public_id,
            url: result.secure_url
        }
    }
    
    //Update avatar
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({success: true, user})
})


//Admin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.find({});
    res.status(200).json({success: true, user})
})

// Get users details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }
    res.status(200).json({success: true, user})
})

// Update admin profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async(req,res,next) =>{

    //Update avatar
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({success: true, user})
})

// Delete User => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }

    //Remove avatar from cloudinary

    await user.remove()

    res.status(200).json({success: true, user})
})