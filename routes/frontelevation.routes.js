const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const frontElevationController = require('../controllers/frontelevation.controller');
const cors = require('cors');
router.use(cors({ origin: '*' }));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploadedImages');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/getElevations', frontElevationController.getAllModels);
router.get('/filterElevations', frontElevationController.getModelByStyleAndColor);
router.post('/uploadElevation', upload.single('model'), frontElevationController.uploadModel);
router.post('/uploadfolderElevation', upload.single('folder'), frontElevationController.uploadFolder);




module.exports = router;
