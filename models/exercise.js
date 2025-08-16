const mongoose = require("mongoose");

const { Schema } = mongoose;

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  part: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  subpart: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        part: {
          type: String,
          required: true,
        },
      },
    ],
  },
  classification: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
