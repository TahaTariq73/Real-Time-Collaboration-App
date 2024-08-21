const express = require("express");
const isAuthUser = require("../middlewares/auth");
const { profilePicUpload } = require("../config/multer");

const {
    login,
    registerUser,
    logout,
    getSingleUser,
    loadUser
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(profilePicUpload.single("file"), registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/user").get(isAuthUser, getSingleUser);
router.route("/me").get(isAuthUser, loadUser);

module.exports = router;