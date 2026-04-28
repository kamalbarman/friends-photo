const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// stats
router.get("/stats", auth, admin, async (req, res) => {
  const users = await User.countDocuments();
  const posts = await Post.countDocuments();
  res.json({ users, posts });
});

// all posts
router.get("/posts", auth, admin, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// delete post
router.delete("/post/:id", auth, admin, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ msg: "Not found" });

  const filePath = path.join(__dirname, "../uploads", path.basename(post.imageUrl));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await post.deleteOne();

  res.json({ msg: "Deleted" });
});

// delete user
router.delete("/user/:id", auth, admin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

module.exports = router;