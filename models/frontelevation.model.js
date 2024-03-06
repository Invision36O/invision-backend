const mongoose = require('mongoose');

const frontElevationSchema = new mongoose.Schema({
  name: String,
  style: {
    type: String,
    required: true
  },
  colorScheme: {
    type: String,
    required: true
  },
  
  modelPath: {
    type: String,
    required: true
  }
});

const FrontElevation = mongoose.model('FrontElevation', frontElevationSchema);

module.exports = FrontElevation;
