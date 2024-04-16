const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require("../config/config.json")

if (!fs.existsSync(config.image_upload_directory)) {
  fs.mkdirSync(config.image_upload_directory, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.image_upload_directory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;