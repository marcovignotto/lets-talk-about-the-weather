const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("config");

const { check, validationResult } = require("express-validator");

const BackendUser = require("../models/BackendUser");

// @route   GET api/users
// @desc    Get all userss
// @access  Private

// @route   POST api/users
// @desc    add a users
// @access  Private

//
//
// disable for security
//
//

// router.post(
//   "/",
//   [
//     check("userName", "Username is required!").not().isEmpty(),
//     check("email", "Please insert a valid E-mail").isEmail(),
//     check(
//       "password",
//       "Please insert a valid password with 6 or more characters"
//     ).isLength({ min: 6 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { userName, email, password } = req.body;

//     try {
//       let user = await BackendUser.findOne({ email });

//       if (user) {
//         return res.status(400).json({ msg: "Username already exists!" });
//       }

//       user = new BackendUser({
//         userName,
//         email,
//         password,
//       });

//       const salt = await bcrypt.genSalt(10);

//       // insert the hashed password into the obj
//       user.password = await bcrypt.hash(password, salt);

//       await user.save();

//       const payload = {
//         user: {
//           id: user.id,
//         },
//       };

//       jwt.sign(
//         payload,
//         config.get("authLocalApi.jwtSecret"),
//         {
//           // expiresIn: 360000,
//         },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// @route   PUT api/users/:id
// @desc    Update users
// @access  Private

// @route   DELETE api/users/:id
// @desc    Delete users
// @access  Private

module.exports = router;
