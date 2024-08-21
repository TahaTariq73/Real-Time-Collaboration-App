const express = require("express");
const isAuthUser = require("../middlewares/auth");
const { imageVideoUpload, audioUpload } = require("../config/multer");

const {
    sendMessage,
    sendFiles,
    sendVoicenote
} = require("../controllers/messageController");

const router = express.Router();

router.route("/sendmessage").post(isAuthUser, sendMessage);
router.route("/sendfiles").post(isAuthUser, imageVideoUpload.array("files", 10), sendFiles);
router.route("/sendvoicenote").post(isAuthUser, audioUpload.single("file") , sendVoicenote);

module.exports = router;