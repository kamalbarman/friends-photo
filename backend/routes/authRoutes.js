const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// register
router.post("/register", async (req, res) => {
    console.log("Register endpoint hit!")
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ username, password: hash });

  res.json(user);
});

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;
