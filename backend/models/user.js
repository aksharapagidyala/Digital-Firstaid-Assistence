const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  height: Number,
  gender: String,
});

module.exports = mongoose.model("User", userSchema);
