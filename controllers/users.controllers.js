const express = require('express')
const User = require ('../models/users.model')

exports.register = (req , res)=>{
    let {name, email, password} = req.body;

    let user = new User({
        name,
        email,
        password,
    })

    user.save().then((user)=>{
        res.status(200).json({"Message":"User Created" , user:user})
    }).catch(err=>{
        res.status(500).json({"Message":"User Not Created" , err:err})
    })
}

