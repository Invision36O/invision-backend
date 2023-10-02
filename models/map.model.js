const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  image:String
},
{
collection:"Image"
}

  // data: Buffer, 
  // contentType: String,
);

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;








// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const mapSchema = new Schema({
//   map:{
//     type:img,
//     required:true,
//   },  


// });
// const Map = mongoose.model('Map', mapSchema);

// module.exports= Map;
