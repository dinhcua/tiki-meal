const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  const limit = req.query.limit;
  const title = req.query.title
  try {
    // console.log("title",title);
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      }).limit(5);
    } else if (title) {
      // posts = await Post.find({"title": "/.*" + title +".*/" });
      console.log("dang search", title);
      // await Post.createIndexes({photo: "text"})
      // posts = await Post.find({$text : {$search : "163526" }})
      // console.log(posts);
    }
    else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Like post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(post);
    if (!post.likes.includes(req.body.username)) {
      try {
        const likePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $push:  {likes: req.body.username}
          },
          { new: true }
        );
        res.status(200).json(likePost);
        // console.log("oke");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      console.log("Ng?????i d???ng ???? like b??i vi???t n??y");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/unlike/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post.likes);
    console.log(req.body.username);
    if (post.likes.includes(req.body.username)) {
      try {
        const likePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $pull:  {likes: req.body.username}
          },
          { new: true }
        );
        console.log(likePost);
        // console.log(";ll");
        res.status(200).json(likePost);
        // console.log("oke");
      } catch (err) {
        // console.log("l???i r???i");
        res.status(500).json(err);
      }
    } else {
      console.log("Ng?????i d???ng ???? like b??i vi???t n??y");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/comment/:id", async (req, res) => {
  console.log(req.body);
  try {
    // const post = await Post.findById(req.params.id);
    // const 
      try {
        // console.log(req.body);
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $push: {comments: req.body},
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
