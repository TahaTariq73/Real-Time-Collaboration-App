const User = require("../models/UserModal");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");
const sendToken = require("../utilities/sendToken");

exports.registerUser = catchAsyncError (
    async (req, res, next) => {
        const { name, email, password } = req.body;
    
        if (req.file === undefined) {
            return next(new ErrorHandler("Please upload a profile picture", 401));
        }

        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all credentials", 400));
        }

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return next(new ErrorHandler("User already exist with this email", 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            profilePic: `${req.file.destination}${req.file.filename}`
        })
        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        sendToken(user, 200, res);
    }
)

exports.login = catchAsyncError (
    async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter all credentials", 400));
        }
    
        const user = await User.findOne({ email }).select("+password");
        if (!user) {  
            return next(new ErrorHandler("Invalid credentials", 400));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid credentails", 400));
        }

        sendToken(user, 200, res);
    }
)

exports.logout = catchAsyncError (
    async (req, res, next) => {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({
            success: true,
            message: "logged out successfully"
        })
    }
)

exports.getSingleUser = catchAsyncError (
    async (req, res, next) => {
        if (!req.query.keyword) {
            return next(new ErrorHandler("Please provide name or email", 400));
        }

        const keyword = req.query.keyword ? {
            $or: [
                { name: req.query.keyword },
                { email: req.query.keyword }
            ]
        } : {}

        const user = await User.findOne(keyword);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.json({
            success: true, 
            user
        })
    }
)

exports.loadUser = catchAsyncError (
    async (req, res, next) => {
        const user = await User.findById(req.user._id);        

        res.status(200).json({
            success: true,
            user
        })
    }
)