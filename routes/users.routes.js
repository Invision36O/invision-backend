const express = require('express');
const user = express.Router();
const cors = require('cors');
const controller = require('../controllers/users.controllers')

user.use(cors( { origin: '*' , } ));


user.post('/register', controller.register)

module.exports = user;