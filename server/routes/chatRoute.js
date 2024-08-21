const express = require("express");
const isAuthUser = require("../middlewares/auth");
const { profilePicUpload } = require("../config/multer");

const {
    createChat,
    accessChat,
    createGroupChat,
    getAllChats
} = require("../controllers/chatController");

const router = express.Router();

router.route("/createchat").post(isAuthUser, createChat);
router.route("/creategroupchat").post(isAuthUser, profilePicUpload.single("file"), createGroupChat);
router.route("/accesschat").post(isAuthUser, accessChat);
router.route("/getallchats").get(isAuthUser, getAllChats);

module.exports = router;