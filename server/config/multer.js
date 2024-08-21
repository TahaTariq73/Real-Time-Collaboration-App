const multer = require("multer");
const path = require("path");
const fs = require("fs");

function getRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

// For uploading profile pictures in multer disk

const profilePicsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pics/');
    }, filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + getRandomSixDigitNumber() + path.extname(file.originalname));
    }    
})

const profilePicsFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

exports.profilePicUpload = multer({ storage: profilePicsStorage, fileFilter: profilePicsFilter });

// For uploading messages files in multer disk

const imageVideoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images-videos/');
    }, filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + getRandomSixDigitNumber() + path.extname(file.originalname));

    }    
})

const imageVideoFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mkv'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

exports.imageVideoUpload = multer({ storage: imageVideoStorage, fileFilter: imageVideoFilter });

// For uploading voice messages in multer disk

const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/audio/');
    }, filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + getRandomSixDigitNumber() + path.extname(file.originalname));
    }    
})

const audioFilter = (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

exports.audioUpload = multer({ storage: audioStorage, fileFilter: audioFilter });