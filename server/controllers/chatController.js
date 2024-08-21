const Chat = require("../models/ChatModal");
const User = require("../models/UserModal");
const Message = require("../models/MessageModal");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utilities/errorHandler");

exports.createChat = catchAsyncError (
    async (req, res, next) => {
        const { userId } = req.body;
        if (!userId) {
            return next(new ErrorHandler("No user selected for chat", 400));
        }

        const isUser = await User.findById(userId);
        if (!isUser) {
            return next(new ErrorHandler("The user could not be found", 400));
        }

        if (userId == req.user._id) {
            return next(new ErrorHandler("The user could not be found", 400));
        }

        const chatExist = await Chat.find({
            users: [req.user._id, userId]
        })
        if (chatExist.length != 0) {
            return next(new ErrorHandler("This chat already exists", 400));
        }

        const chatInfo = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        let chat = await Chat.create(chatInfo);
        chat = await Chat.findById(chat._id).populate("users", "-password").populate("latestMessage");

        res.status(200).json({
            success: true,
            chat
        })
    }
)

exports.accessChat = catchAsyncError (
    async (req, res, next) => {
        const { chatId } = req.body;
        if (!chatId) {
            return next(new ErrorHandler("Please select a chat before proceeding", 400));
        }

        let chat = await Chat.findById(chatId);        
        if (!chat || !chat.users.includes(req.user._id)) {
            return next(new ErrorHandler("Please select a chat before proceeding", 400));
        }

        chat = await chat.populate("users", "-password");        
        const messages = await Message.find({ referredChat: chatId }).populate("sender", "-password");
        
        res.status(200).json({
            success: true,
            chat,
            messages
        })
    }
)

exports.createGroupChat = catchAsyncError (
    async (req, res, next) => {
        const { chatName, users } = req.body;
        if (!chatName) {
            return next(new ErrorHandler("Please enter all credentials", 400));
        }

        if (users == undefined) {
            return next(new ErrorHandler("Please add atleast two Homies", 400));
        }

        if (users.length < 2 || !Array.isArray(users)) {
            return next(new ErrorHandler("Please add atleast two Homies", 400));
        }
            
        if (users.includes(String(req.user._id))) {
            return next(new ErrorHandler("Internal Server Error", 400));
        }
        await users.push(req.user._id);        

        if (req.file === undefined) {
            return next(new ErrorHandler("Please upload a profile picture", 401));
        }

        const chatInfo = {
            chatName,
            isGroupChat: true,
            users,
            groupAdmin: req.user._id,
            chatIcon: `${req.file.destination}${req.file.filename}`
        }
        let chat = await Chat.create(chatInfo);
        chat = await Chat.findById(chat._id)
        .populate("groupAdmin")
        .populate("latestMessage")
        .populate("users", "-password");

        res.status(200).json({
            success: true,
            chat
        })
    }
)

exports.getAllChats = catchAsyncError (
    async (req, res, next) => {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        }).populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage");

        res.status(200).json({
            success: true,
            chats
        })
    }
)