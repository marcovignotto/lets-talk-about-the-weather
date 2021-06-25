/**
 * @desc Middleware for validation
 */

const { check, validationResult } = require("express-validator");

const userEmailValidator = [
  check("userName", "Username is required!").not().isEmpty(),
  check("email", "Please insert a valid E-mail").isEmail(),
  check(
    "password",
    "Please insert a valid password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({
        message: "Error!",
        errors: errors.array(),
        status: 400,
      });
    }

    next();
  },
];

const locationValidator = [
  check("location", "Location is required").not().isEmpty(),
  check("firstName", "Name is required").not().isEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({
        message: "Error!",
        errors: errors.array(),
        status: 400,
      });
    }

    next();
  },
];

module.exports = { userEmailValidator, locationValidator };
