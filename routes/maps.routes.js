const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const imageController = require('../controllers/maps.controller');
const cors = require('cors');
router.use(cors({ origin: '*' }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/uploadmap', upload.single('image'), imageController.uploadImage);

module.exports = router;
