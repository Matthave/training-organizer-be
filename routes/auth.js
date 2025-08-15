const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

const passwordCheck =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Wprowadź poprawny adres email.")
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Ten adres email jest już zajęty.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().matches(passwordCheck),
  ],
  authController.signup,
);

router.post("/login", authController.login);

module.exports = router;
