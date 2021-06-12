const { request, response } = require("express");
const mongoose = require("mongoose");
const Post = require("../models/post");
mongoose.model("Post");

exports.createPost = (request, response) => {
  const { title, body, pic } = request.body;
  
  if (!title || !body || !pic) {
    return response.status(411).json({ message: "please fill out all required fields" });
  } else {
      //getting rid of the password
    request.user.password = undefined;
    //saving data to database
    const post = new Post({
      title,
      body,
      photo:pic,
      postedBy: request.user,
    });
    post.save()
      .then((result) => {
        response.status(201).json({ post: result });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.allPosts = (request, response)=>{
    Post.find()
    .populate('postedBy', "_id name")//it's a method to extarct the information needed
    .then(posts=>{
        response.status(200).json({posts})
    })
    .catch(error=>{
        console.log(error);
    })
}

exports.myPost = (request, response)=>{
    Post.find({postedBy: request.user.id})
    .populate('postedBy', "_id name")
    .then(mypost=>{
        response.status(200).json({mypost})
    })
    .catch(error=>{
        console.log(error);
    })
    
}