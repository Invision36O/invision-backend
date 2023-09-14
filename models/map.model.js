const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  map:{
    type:String,
    required:true,
  },  


});
const Map = mongoose.model('Map', mapSchema);

module.exports= Map;
