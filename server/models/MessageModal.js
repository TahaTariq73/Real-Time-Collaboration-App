const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true,
        maxLength: [5000, "Message can't exceed 5000 chars"]
    },
    fileType: {
        type: String,
        default: ""
    },
    fileUrl: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "unread"
    },
    referredChat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema);