const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  image:String
},
{
collection:"Image"
}
);

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;