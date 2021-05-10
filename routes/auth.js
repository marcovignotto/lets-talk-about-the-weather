/**
 * @description route for the authentication
 * of the users in the backend
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

const { check, validationResult } = require("express-validator");

const BackendUser = require("../models/BackendUser");

// @route   GET api/auth
// @desc    Get all auths
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    // req.user is assign in the middleware
    const user = await BackendUser.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// @route   POST api/auth
// @desc    add a auth
// @access  Public

router.post(
  "/",
  [
    check("email", "Please insert a valid E-mail").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await BackendUser.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) res.status(400).json({ msg: "Invalid Credentials" });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/auth/:id
// @desc    Update auth
// @access  Private

// @route   DELETE api/auth/:id
// @desc    Delete auth
// @access  Private

module.exports = router;
