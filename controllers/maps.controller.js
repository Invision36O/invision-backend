const { default: mongoose } = require('mongoose');
const Map = require('../models/map.model');

exports.uploadImage = async (req,res) => {
const imagename=req.file.filename;
console.log(imagename)

try{
  await Map.create({image:imagename});
  res.json({imagename:imagename});
}
catch(error){
  res.json({status:error});
}
}