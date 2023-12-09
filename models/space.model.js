const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  filename: String,
  destinationPath: String,
});

const Space = mongoose.model('Space', modelSchema);

module.exports = Space;