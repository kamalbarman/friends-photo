const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// upload
router.post("/upload", auth, upload.single("photo"), async (req, res) => {
  const now = new Date();

  const post = await Post.create({
    imageUrl: `/images/${req.file.filename}`,
    userId: req.user.id,
    createdAt: now,
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  });

  res.json(post);
});

// get posts with filter
router.get("/", async (req, res) => {
  const { year, month, day } = req.query;

  let filter = {};
  if (year) filter.year = Number(year);
  if (month) filter.month = Number(month);
  if (day) filter.day = Number(day);

  const posts = await Post.find(filter).sort({ createdAt: -1 });

  res.json(posts);
});

// download
router.get("/download/:filename", (req, res) => {
  const path = require("path");
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});

module.exports = router;