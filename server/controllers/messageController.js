const Chat = require("../models/ChatModal");
const Message = require("../models/MessageModal");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");

exports.sendMessage = catchAsyncError (
    async (req, res, next) => {
        const { content, referredChat } = req.body;
        if (!content || !referredChat) {
            return next(new ErrorHandler("The request could not be processed due to missing data", 400));
        }

        const chat = await Chat.findById(referredChat);
        if (!chat || !chat.users.includes(req.user._id)) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }

        const messageInfo = {
            sender: req.user._id,
            content,
            referredChat
        }
        let message = await Message.create(messageInfo);
        message = await Message.findById(message._id).populate("sender", "-password");

        res.status(200).json({
            success: true,
            message
        })
    }
)

exports.sendFiles = catchAsyncError (
    async (req, res, next) => {
        const { referredChat } = req.body;
        if (!referredChat) {
            return next(new ErrorHandler("The request could not be processed due to missing data", 400));
        }

        const chat = await Chat.findById(referredChat);
        if (!chat || !chat.users.includes(req.user._id)) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }

        if (req.files.length == 0) {
            return next(new ErrorHandler("Please select a single image", 401));
        }
        
        let messages = [];

        for (let i = 0; i < req.files.length; i++) {
            const messageInfo = {
                sender: req.user._id,
                content: "",
                referredChat,
                fileUrl: `${req.files[i].destination}${req.files[i].filename}`,
                fileType: `${req.files[i].mimetype}`
            }            

            let message = await Message.create(messageInfo);
            message = await Message.findById(message._id).populate("sender", "-password");

            messages.push(message);
        }

        res.json({
            success: true,
            messages
        })
    }
)

exports.sendVoicenote = catchAsyncError (
    async (req, res, next) => {
        const { referredChat } = req.body;
        if (!referredChat) {
            return next(new ErrorHandler("The request could not be processed due to missing data", 400));
        }

        const chat = await Chat.findById(referredChat);
        if (!chat || !chat.users.includes(req.user._id)) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }

        if (req.file === undefined) {
            return next(new ErrorHandler("Please send a voice note", 401));
        }

        const messageInfo = {
            sender: req.user._id,
            content: "",
            referredChat,
            fileUrl: `${req.file.destination}${req.file.filename}`,
            fileType: `${req.file.mimetype}`
        }

        let message = await Message.create(messageInfo);
        message = await Message.findById(message._id).populate("sender", "-password");
        
        res.json({
            success: true,
            message
        })
    }
)