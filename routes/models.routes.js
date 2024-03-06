const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const extract = require('extract-zip');
const modelController = require('../controllers/models.controller');
router.use(cors( { origin: '*' , } ));
const upload = multer({ dest: 'uploads/' });

router.post('/uploadzip', upload.single('file'), modelController.uploadFolder)
router.post('/upload', upload.any(), modelController.uploadModel);
router.get('/getModels', modelController.getModels);

module.exports = router;