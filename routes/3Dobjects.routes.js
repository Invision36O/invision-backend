const express = require('express');
const router = express.Router();
const objectController = require('../controllers/3Dobject.controller'); // Correct the path to your controller

// Route to get all models
router.get('/objects', objectController.getAllObjects);

// Route to get models by category
router.get('/objectscategory/:category', objectController.getObjectsByCategory);

module.exports = router;
