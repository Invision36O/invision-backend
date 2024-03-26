const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
  name: String,
  category: String,
  destinationPath: String,
  imagepath:String,
});

const Object = mongoose.model('Object',objectSchema );

module.exports = Object;