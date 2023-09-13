const express = require('express')
const mongoose = require("mongoose");


const bodyParser = require('body-parser')
const addfloorplan= require('./routes/floorUpload.routes')
const app = express()


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

app.use(bodyParser.json())


// Adding a Router
app.use('/user', addfloorplan);


mongoose
  .connect(
    "mongodb+srv://sadia:1234@cluster0.daqmhiu.mongodb.net/?retryWrites=true&w=majority"
    )
  .then(() => {
    app.listen(3001);
    console.log("listening on port 3001")
  })
  .catch((err) => {
    console.log(err);
  });