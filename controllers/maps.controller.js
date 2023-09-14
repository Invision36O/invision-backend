const Map = require("../models/map.model");



exports.uploadMap = async(req,res)=>{
    
    const map = req.body.map;

    let newMap = new Map({
        map
    })

    newMap.save().then(result=>{
        console.log('Posted');
        res.status(200).json("done added"+result)
    })
    .catch(err=>{
        console.log(err);
    })
}