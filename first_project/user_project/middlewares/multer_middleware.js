const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../user_project/file_images');
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    const mail = req.body.email_id.split('@');
    const filename = `${mail[0]}_${name}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;