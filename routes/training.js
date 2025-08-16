const express = require("express");
const { body } = require("express-validator");
const trainingController = require("../controllers/training");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/add",
  isAuth,
  [
    body("name").trim().not().isEmpty().withMessage("Nazwa jest wymagana."),
    body("days")
      .isArray({ min: 1 })
      .withMessage("Trening musi zawierać co najmniej jeden dzień."),
  ],
  trainingController.addTraining,
);

router.get("/", isAuth, trainingController.getTrainings);

router.get("/:trainingId", isAuth, trainingController.getTrainingById);

module.exports = router;
