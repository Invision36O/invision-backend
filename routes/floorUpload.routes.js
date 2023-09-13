const express=require("express");
const Router=express.Router();

const FPUploadController=require("../controllers/floorUpload.controllers");

//Router.get("/getplan",FPUploadController.getfloorPlans)
Router.post("/addplan",FPUploadController.AddFloorPlan)

module.exports = Router;