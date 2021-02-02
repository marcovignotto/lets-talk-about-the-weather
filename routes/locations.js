const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// import dbCleaning
const dbCleaning = require("../config/dbDelete");

const { check, validationResult } = require("express-validator");

const Location = require("../models/Location");

// @route   GET api/location
// @desc    Get all locations
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    const locations = await Location.find({ locations: req.locations }).sort({
      date: -1,
    });
    res.json(locations);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/location
// @desc    add a location
// @access  Private

router.post(
  "/",
  auth,
  //   [
  //     check("Location", "Task is required").not().isEmpty(),
  //     check("priority", "Give it a priority").not().isEmpty(),
  //   ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // console.log(req);
    // console.log(res);

    const {
      firstName,
      language,
      description,
      icon,
      location,
      mainWeather,
      temperature,
      wind,
    } = req.body;

    try {
      const newLocation = new Location({
        firstName,
        language,
        description,
        icon,
        location,
        mainWeather,
        temperature,
        wind,
      });

      //   dbCleaning().catch(console.dir);

      const toDo = await newLocation.save();

      res.json(toDo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/location/:id
// @desc    Update location
// @access  Private

// @route   DELETE api/location/:id
// @desc    Delete location
// @access  Private

module.exports = router;
