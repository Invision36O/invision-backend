const express = require('express');
const space = express.Router();
const cors = require('cors');
const controller = require('../controllers/space.contoller')

space.use(cors( { origin: '*' , } ));


space.post('/register', controller.spaceData)
space.get('/getData', controller.getData)

module.exports = space;