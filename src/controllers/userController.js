require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const MAXAGE = Math.floor(Date.now() / 1000) + 60 * 60
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;

mongoose.model("User");

exports.register = (request, response) => {
  const { name, email, password } = request.body;
  //verfiy if all the required fields has been satisfied
  if (!name || !email || !password) {
    return response.status(411)
      .json({ message: "please fill all the required fields" });
  }
  if(!EMAIL_REGEX.test(email)){
    return response.status(400).json({message: "invalid email"})
  }
  if(!PASSWORD_REGEX.test(password)){
    return response.status(400).json({message :"invalid password (must length 4 - 12 and include 1 number at least)"})
  }
  
  //check if the email has not been used before
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return response.status(422)
          .json({ message: "this user exist already!" });
      }

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user.save()
          .then((user) => {
            response.status(200)
              .json({ message: "your account has been created succssfully!" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.signin = (request, response) => {
  const { email, password } = request.body;
  //verfiy if the required fields has been satsfied
  if (!email || !password) {
    return response .status(411)
      .json({ message: "please fill all the required fields" });
  }
  //verfiy if the user has already been registred or not
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      //(verfiy email) never give a hacker hint
      return response.status(422).json({ message: "Invalid email or password " });
    }
    //verfiy password
    bcrypt.compare(password, savedUser.password).then((correctPassword) => {
      if (!correctPassword) {
        //(verfiy password) never give a hacker hint
        return response.status(422).json({ message: "Invalid email or password " });
      } else {
          const user ={
              id: savedUser.id,
              Name: savedUser.name,
              email: savedUser.email,
              exp:MAXAGE
          }
          const token = jwt.sign(user, process.env.JWT_SECRET)
          response.json({token, user})
      }
    });
  })
  .catch(error=>{
      console.log(error);
  })
};

