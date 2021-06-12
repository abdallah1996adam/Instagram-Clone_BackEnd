const { request, response } = require("express");
const express = require("express");
const isAuth = require("../middlewares/isAuth");
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')

const router = express.Router();

router.get("/", (request, response) => {
  response.status(200).json({ message: "Hello" });
});
router.get("/private", isAuth, (request, response) => {
  response.status(200).json({ message: "welcome in my private page" });
});


//user post routes
router.post("/register",userController.register);
router.post('/signin',userController.signin)
//post post routes
router.post('/newpost',isAuth,postController.createPost)
//post get routes
router.get('/allposts',postController.allPosts)
router.get('/myposts',isAuth, postController.myPost)














router.all("*", (request, response) => {
  response.status(404).json({ message: "page is not found!" });
});

module.exports = router;
