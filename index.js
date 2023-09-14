const express = require('express')
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require('body-parser')
const userRoutes = require('./routes/users.routes')
const mapRoutes = require('./routes/maps.routes')
const app = express()


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

app.use(bodyParser.json())


// Adding a Router
app.use('/user', userRoutes);
app.use('/map', mapRoutes);


mongoose
  .connect(process.env.mongo)
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.port);
    console.log("listening on port 3001")
  })
  .catch((err) => {
    console.log(err);
  });