const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  destinationPath: String,
});

const Photo = mongoose.model('Photo', imageSchema);

module.exports = Photo;