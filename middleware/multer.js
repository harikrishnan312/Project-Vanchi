const multer = require("multer");

const path = require("path");

const adminController = require('../controller/adminController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/packageImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
    
});

  const upload = multer({
    storage: storage,
    fileFilter: adminController.fileFilter,
  });
// const upload = multer({ storage: storage });

module.exports = upload;