const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  filename: String,
  destinationPath: String,
  name: String,
},
);

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;