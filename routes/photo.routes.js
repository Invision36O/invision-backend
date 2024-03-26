const express = require('express');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const photoController = require('../controllers/photo.controller');
router.use(cors( { origin: '*' , } ));
const upload = multer({ dest: 'uploads/photo' });

router.post('/upload', upload.array('images'), photoController.uploadImages);
router.post('/getImage', photoController.findImage);
router.post('/photo', photoController.runMeshroom);
router.post('/runMeshroom', photoController.runMeshroom);

module.exports = router;