require('dotenv').config();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User = require('../models/user')
mongoose.model('User')


const isAuth = (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.status(401).json({ message: "you have to be logged in!" });
  }
  //getting the token
  const token = authorization.replace("Bearer ","");
  jwt.verify(token,process.env.JWT_SECRET, (error, payload)=>{
      if(error){
         return response.status(401).json({message:"you have to be logged in!"})
      }
      
      const {id} = payload
      User.findById(id).then(userData=>{
          //to make all user data avaliable and get it when a user posting a new post 
          request.user = userData
          next();
      })
      
  })
};

module.exports = isAuth;
