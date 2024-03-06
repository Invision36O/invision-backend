const ObjectModel = require('../models/3Dobjects.model'); 
const { default: mongoose } = require('mongoose');
// Controller to get all models
exports.getAllObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find({});
    res.status(200).json(objects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get models by category
exports.getObjectsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const objects = await ObjectModel.find({ category: category });
    res.status(200).json(objects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
