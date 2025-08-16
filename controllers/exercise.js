const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.addExercise = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error();
    error.statusCode = 422;
    error.data = errors.array();
    error.message = error.data[0].msg;
    return next(error);
  }

  const { name, description, part, subpart, classification } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    const exercise = {
      name,
      description,
      part,
      subpart: subpart || [],
      classification,
    };

    if (!user.exercises) {
      user.exercises = [];
    }

    user.exercises.push(exercise);
    await user.save();

    res.status(201).json({
      message: "Ćwiczenie zostało dodane.",
      exercise,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Nie udało się dodać ćwiczenia. Spróbuj ponownie.";
    }
    next(err);
  }
};

exports.getExercises = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Pobrano ćwiczenia.",
      exercises: user.exercises,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Nie udało się pobrać ćwiczeń. Spróbuj ponownie.";
    }
    next(err);
  }
};

exports.deleteExercise = async (req, res, next) => {
  const { exerciseId } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    const exerciseIndex = user.exercises.findIndex(
      (exercise) => exercise._id.toString() === exerciseId,
    );

    if (exerciseIndex === -1) {
      const error = new Error("Nie znaleziono ćwiczenia.");
      error.statusCode = 404;
      throw error;
    }

    user.exercises.splice(exerciseIndex, 1);
    await user.save();

    res.status(200).json({ message: "Ćwiczenie zostało usunięte." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Nie udało się usunąć ćwiczenia. Spróbuj ponownie.";
    }
    next(err);
  }
};

exports.editExercise = async (req, res, next) => {
  const { exerciseId } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error();
    error.statusCode = 422;
    error.data = errors.array();
    error.message = error.data[0].msg;
    return next(error);
  }

  const { name, description, part, subpart, classification } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    const exerciseIndex = user.exercises.findIndex(
      (exercise) => exercise._id.toString() === exerciseId,
    );

    if (exerciseIndex === -1) {
      const error = new Error("Nie znaleziono ćwiczenia.");
      error.statusCode = 404;
      throw error;
    }

    const exercise = user.exercises[exerciseIndex];
    exercise.name = name;
    exercise.description = description;
    exercise.part = part;
    exercise.subpart = subpart || [];
    exercise.classification = classification;

    await user.save();

    res.status(200).json({
      message: "Ćwiczenie zostało zaktualizowane.",
      exercise,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Nie udało się zaktualizować ćwiczenia. Spróbuj ponownie.";
    }
    next(err);
  }
};
