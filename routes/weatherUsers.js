const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//
// AUTH DISABLED
//

// import dbCleaning
const dbCleaning = require("../config/dbDelete");

const { check, validationResult } = require("express-validator");

const WeatherUser = require("../models/WeatherUser");

// @route   GET api/weatherusers
// @desc    Get all weatherusers
// @access  Private

router.get("/", async (req, res) => {
  console.log(req);
  try {
    const weatherUsers = await WeatherUser.find({
      weatherUsers: req.weatherUsers,
    }).sort({
      date: -1,
    });
    res.json(weatherUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/weatherusers
// @desc    add a weatherusers
// @access  Private

// router.post(
//   "/",
//   auth,
//   //   [
//   //     check("Location", "Task is required").not().isEmpty(),
//   //     check("priority", "Give it a priority").not().isEmpty(),
//   //   ],
//   async (req, res) => {
//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //   return res.status(400).json({ errors: errors.array() });
//     // }

//     // console.log(req);
//     // console.log(res);

//     const {
//       firstName,
//       language,
//       description,
//       icon,
//       location,
//       mainWeather,
//       temperature,
//       wind,
//     } = req.body;

//     try {
//       const newLocation = new Location({
//         firstName,
//         language,
//         description,
//         icon,
//         location,
//         mainWeather,
//         temperature,
//         wind,
//       });

//       //   dbCleaning().catch(console.dir);

//       const toDo = await newLocation.save();

//       res.json(toDo);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// @route   PUT api/weatherusers/:id
// @desc    Update weatherusers
// @access  Private

// @route   DELETE api/weatherusers/:id
// @desc    Delete weatherusers
// @access  Private

module.exports = router;
