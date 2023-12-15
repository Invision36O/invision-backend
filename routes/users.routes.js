const express = require('express');
const user = express.Router();
const cors = require('cors');
const controller = require('../controllers/users.controllers')

user.use(cors( { origin: '*' , } ));


user.post('/signup', controller.signup)
user.post('/login', controller.login)
user.get('/getuser', controller.getUser)
user.put('/updateUser/:_id', controller.updateUser)

module.exports = user;