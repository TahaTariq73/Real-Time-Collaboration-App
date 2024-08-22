const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Config Environment Variables

if (process.env.NODE_ENV != "PRODUCTION") {
    dotenv.config({ path: "server/config/config.env" });
}

// Rejecting node TLS - Used only for development mode

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Using Builtin And Installed Middlewares


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Creating the uploads directories if they don't exist

const profilePicDir = 'uploads/profile-pics';
const imageVideoDir = 'uploads/images-videos';
const audioDir = 'uploads/audio';

if (!fs.existsSync(profilePicDir)) {
    fs.mkdirSync(profilePicDir, { recursive: true });
}
if (!fs.existsSync(imageVideoDir)){
    fs.mkdirSync(imageVideoDir, { recursive: true });
}
if (!fs.existsSync(audioDir)){
    fs.mkdirSync(audioDir, { recursive: true });
}

app.use("/api/v1", require("./routes/UserRoute"));
app.use("/api/v1", require("./routes/messageRoute"));
app.use("/api/v1", require("./routes/chatRoute"));

// Serve static files from uploads directory

app.use('/uploads/images-videos', express.static('uploads/images-videos'));
app.use('/uploads/audio', express.static('uploads/audio'));
app.use('/uploads/profile-pics', express.static('uploads/profile-pics'));


// <------- Serve static files from the dist directory ------->

app.use(express.static(path.join(__dirname, "../client/dist")));

// <------- Serve the index.html for all routes (for SPA routing) ------->

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
})

app.use(errorMiddleware);

module.exports = app;