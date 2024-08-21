const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");
const User = require("../models/UserModal");
const jwt = require("jsonwebtoken");

module.exports = catchAsyncError (
    async (req, res, next) => {
        const { token } = req.cookies;        

        if (!token) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }
        
        const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    }
)