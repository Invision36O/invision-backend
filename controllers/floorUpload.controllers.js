const FloorPlanmodel=require("../models/floorUpload.model");



exports.AddFloorPlan = async(req,res)=>{
    
    const fpimage=req.body.floorname
    const fpname=req.body.floorimage

    let FloorPlans=new FloorPlanmodel({
        fpimage,
        fpname,
    })

    FloorPlans.save().then(result=>{
        console.log('Posted');
        res.status(200).json("done added"+result)
    })
    .catch(err=>{
        console.log(err);
    })
}