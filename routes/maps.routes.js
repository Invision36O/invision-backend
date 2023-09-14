const express = require("express");
const Router = express.Router();

const controller = require("../controllers/floorUpload.controllers");

//Router.get("/getplan",FPUploadController.getfloorPlans)
Router.post("/uploadmap", controller.uploadMap)

module.exports = Router;