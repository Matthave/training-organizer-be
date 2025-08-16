const mongoose = require("mongoose");
const exerciseSchema = require("./exercise").schema;

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
});

module.exports = mongoose.model("User", userSchema);
