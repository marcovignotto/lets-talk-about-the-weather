const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//
// AUTH DISABLED
//

const { check, validationResult } = require("express-validator");

const WeatherUser = require("../models/WeatherUser");

// @route   GET api/weatherusers
// @desc    Get all weatherusers
// @access  Private

router.get("/", auth, async (req, res) => {
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

router.post(
  "/",
  auth,
  //   auth,
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
    // const resDb = await mongoose.connect(db, dbOptions);
    // const resDb = await WeatherUser.find();
    try {
      const { firstName, language, location, unit, mainLocation } = req.body;

      // console.log(mainLocation);

      if (mainLocation == true || mainLocation == "true") {
        await WeatherUser.updateMany({}, { mainLocation: false });
      }

      // find last id
      // returns everything and sort it from the last userCode
      const resUserCode = await WeatherUser.find()
        .sort({
          userCode: -1,
        })
        .limit(1);

      const newWeatherUser = new WeatherUser({
        firstName,
        language,
        location,
        unit,
        userCode: resUserCode.length === 0 ? 0 : resUserCode[0].userCode + 1,
        mainLocation,
      });

      const addUser = await newWeatherUser.save();

      res.json(addUser);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/weatherusers/:id
// @desc    Update weatherusers
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
    await WeatherUser.updateMany({}, { mainLocation: false });
  }

  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (language) userFields.language = language;
  if (location) userFields.location = location;
  if (unit) userFields.unit = unit;
  if (userCode) userFields.userCode = userCode;
  if (mainLocation) userFields.mainLocation = mainLocation;

  try {
    let user = await WeatherUser.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user = await WeatherUser.findByIdAndUpdate(
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

// @route   DELETE api/weatherusers/:id
// @desc    Delete weatherusers
// @access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await WeatherUser.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    await WeatherUser.findByIdAndRemove(req.params.id);

    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
