const express = require("express");
const { body } = require("express-validator");
const exerciseController = require("../controllers/exercise");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, exerciseController.getExercises);

router.delete("/:exerciseId", isAuth, exerciseController.deleteExercise);

router.put(
  "/:exerciseId",
  [
    isAuth,
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nazwa ćwiczenia jest wymagana."),
    body("description").optional().isString(),
    body("part").isArray({ min: 1 }).withMessage("Partia jest wymagana."),
    body("part.*.name")
      .notEmpty()
      .isString()
      .withMessage("Nazwa partii jest wymagana."),
    body("subpart").optional().isArray(),
    body("subpart.*.name").if(body("subpart").exists()).notEmpty().isString(),
    body("subpart.*.part").if(body("subpart").exists()).notEmpty().isString(),
    body("classification")
      .isInt({ min: 0 })
      .withMessage("Klasyfikacja musi być liczbą całkowitą."),
  ],
  exerciseController.editExercise,
);

router.post(
  "/add",
  [
    isAuth,
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nazwa ćwiczenia jest wymagana."),
    body("description").optional().isString(),
    body("part").isArray({ min: 1 }).withMessage("Partia jest wymagana."),
    body("part.*.name")
      .notEmpty()
      .isString()
      .withMessage("Nazwa partii jest wymagana."),
    body("subpart").optional().isArray(),
    body("subpart.*.name").if(body("subpart").exists()).notEmpty().isString(),
    body("subpart.*.part").if(body("subpart").exists()).notEmpty().isString(),
    body("classification")
      .isInt({ min: 0 })
      .withMessage("Klasyfikacja musi być liczbą całkowitą."),
  ],
  exerciseController.addExercise,
);

module.exports = router;
