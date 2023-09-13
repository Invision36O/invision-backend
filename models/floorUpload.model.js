const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const FloorPlanSchema=new Schema({
  floorname:{
    type:String,
    required:true,
  },  

 

});
const plans = mongoose.model('floorplan',FloorPlanSchema);

module.exports= plans;
