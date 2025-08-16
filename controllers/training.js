const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.addTraining = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const { name, days } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    const newTraining = {
      name,
      days,
    };

    user.trainings.push(newTraining);
    await user.save();

    res.status(201).json({
      message: "Trening został dodany.",
      training: newTraining,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message =
        "Wystąpił błąd podczas dodawania treningu. Spróbuj ponownie.";
    }
    next(err);
  }
};

exports.getTrainings = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    const trainingNames = user.trainings.map((training) => ({
      _id: training._id,
      name: training.name,
    }));

    res.status(200).json({
      message: "Pobrano nazwy treningów.",
      trainings: trainingNames,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Nie udało się pobrać treningów. Spróbuj ponownie.";
    }
    next(err);
  }
};

exports.getTrainingById = async (req, res, next) => {
  const { trainingId } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Nie znaleziono użytkownika.");
      error.statusCode = 404;
      throw error;
    }

    const training = user.trainings.id(trainingId);
    if (!training) {
      const error = new Error("Nie znaleziono treningu.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Pobrano szczegóły treningu.",
      training,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Nie udało się pobrać treningu. Spróbuj ponownie.";
    }
    next(err);
  }
};
