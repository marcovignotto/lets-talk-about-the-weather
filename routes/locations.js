const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

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

    try {
      const {
        firstName,
        language,
        description,
        icon,
        location,
        unit,
        mainWeather,
        temperature,
        wind,
        userCode,
        mainLocation,
      } = req.body;

      // console.log(mainLocation);

      if (mainLocation === true) {
        await Location.updateMany({}, { mainLocation: false });
      }

      const newLocation = new Location({
        firstName,
        language,
        description,
        icon,
        location,
        unit,
        mainWeather,
        temperature,
        wind,
        userCode,
        mainLocation,
      });

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

router.put("/:id", auth, async (req, res) => {
  const {
    firstName,
    language,
    location,
    unit,
    userCode,
    mainLocation,
  } = req.body;

  if (mainLocation === true || mainLocation === "true") {
    await Location.updateMany({}, { mainLocation: false });
  }

  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (language) userFields.language = language;
  if (location) userFields.location = location;
  if (unit) userFields.unit = unit;
  if (userCode) userFields.userCode = userCode;
  if (mainLocation) userFields.mainLocation = mainLocation;

  try {
    let user = await Location.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user = await Location.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/location/:id
// @desc    Delete location
// @access  Private

module.exports = router;
