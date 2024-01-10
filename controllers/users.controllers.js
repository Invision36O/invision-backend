const express = require('express')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();
const User = require ('../models/users.model')

exports.signup = (req , res)=>{
    let {name, email, username, password} = req.body;

    let user = new User({
        name,
        email,
        username,
        password,
    })

    user.save().then((user)=>{
        res.status(200).json({"Message":"User Created" , user:user})
    }).catch(err=>{
        res.status(500).json({"Message":"User already exists!" , err:err})
    })
}

exports.login = (req, res)=>{

    let{email, password} = req.body;
    User.findOne({email:email}).then((foundUser)=>{
        if(!foundUser){
            res.status(404).send({"Message":"User not found. Try signing up!"})
        }else{
            if(foundUser.password == password){
                let token = jwt.sign({
                    id:foundUser._id,
                    name:foundUser.name
                },
                process.env.jwt_key,{
                    expiresIn: '5h'
                })
                res.status(200).send({"Message":"Successfully LOGGED IN", user:foundUser, token:token})
            }else{
                res.status(500).send({"Message":"Invalid Password"})
            }
        }
    })
}
exports.getUser = async (req, res) => {
    let decodedID;
    let token = req.headers['token'];
    
    jwt.verify(token, process.env.jwt_key, async (err, decoded) => {
      if (err) {
        return res.status(500).send({ message: "Not Authorized" });
      }
  
      req.decoded = decoded;
      decodedID = decoded.id;
  
      try {
        const user = await User.findById(decodedID);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      } catch (error) {
        console.error('Error decoding token:', error);
        res.status(401).json({ message: 'Unauthorized' });
      }
    });
  };
  

exports.updateUser = async (req, res) => {
    const { _id } = req.params;
  
    const user = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };
  
    try {
      const updatedProfile = await User.findByIdAndUpdate(_id, user, { new: true }).exec();
  
      if (!updatedProfile) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedProfile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };