const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  filename: String,
  destinationPath: String,
  model: {
    data: Buffer,
    contentType: String,
},
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;