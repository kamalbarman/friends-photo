const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  imageUrl: String,
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  year: Number,
  month: Number,
  day: Number
});

module.exports = mongoose.model("Post", postSchema);