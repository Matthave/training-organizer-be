const mongoose = require("mongoose");
const exerciseSchema = require("./exercise").schema;

const { Schema } = mongoose;

const exerciseDetailsItemSchema = new Schema(
  {
    series: { type: Number, required: true },
    reps: { type: Number, required: true },
  },
  { _id: false },
);

const daySchema = new Schema(
  {
    id: { type: Number, required: true },
    dayNumber: { type: Number, required: true },
    savedParties: [String],
    selectedExercises: {
      type: Map,
      of: [String],
    },
    exerciseDetails: {
      type: Map,
      of: exerciseDetailsItemSchema,
    },
  },
  { _id: false },
);

const trainingSchema = new Schema({
  name: { type: String, required: true },
  days: [daySchema],
});

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
  trainings: [trainingSchema],
});

module.exports = mongoose.model("User", userSchema);
