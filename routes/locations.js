const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const openWeatherCall = require("../src/components/openWeatherCall");

const { check, validationResult } = require("express-validator");

const Location = require("../models/Location");

// @route   GET api/location
// @desc    Get all locations
// @access  Private

router.get("/", async (req, res) => {
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

router.post("/", auth, async (req, res) => {
  try {
    const {
      firstName,
      language,
      location,
      unit,
      userCode,
      mainLocation,
    } = req.body;

    if (mainLocation == true || mainLocation == "true") {
      await Location.updateMany({}, { mainLocation: false });
    }

    // OW API CALL
    const resOpenWeather = await openWeatherCall(location, unit, language);

    // PARSE IT
    const parsedRes = JSON.parse(resOpenWeather);

    const {
      getLocation = parsedRes.name,
      getMain = parsedRes.weather[0].main,
      getIcon = parsedRes.weather[0].icon,
      getMainDesc = parsedRes.weather[0].description,
      getTemp = parsedRes.main.temp,
      getWind = parsedRes.wind.speed,
      getTimeZone = parsedRes.timezone,
    } = parsedRes;

    const newLocation = new Location({
      firstName,
      language,
      description: getMainDesc,
      icon: getIcon,
      location: getLocation,
      unit,
      mainWeather: getMain,
      temperature: getTemp,
      wind: getWind,
      userCode,
      mainLocation,
      timezone: getTimeZone,
    });

    const toDo = await newLocation.save();

    res.json(toDo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/location/:id
// @desc    Update location
// @access  Private

router.put("/:id", auth, async (req, res) => {
  const {
    firstName,
    language,
    unit,
    location,
    userCode,
    mainLocation,
  } = req.body;

  if (mainLocation === true || mainLocation === "true") {
    await Location.updateMany({}, { mainLocation: false });
  }

  // OW API CALL
  const resOpenWeather = await openWeatherCall(location, unit, language);

  // PARSE IT
  const parsedRes = JSON.parse(resOpenWeather);

  const {
    getLocation = parsedRes.name,
    getMain = parsedRes.weather[0].main,
    getIcon = parsedRes.weather[0].icon,
    getMainDesc = parsedRes.weather[0].description,
    getTemp = parsedRes.main.temp,
    getWind = parsedRes.wind.speed,
    getTimeZone = parsedRes.timezone,
  } = parsedRes;

  const userFields = {};
  if (firstName) userFields.firstName = firstName;
  if (language) userFields.language = language;
  if (mainLocation) userFields.mainLocation = mainLocation;
  if (unit) userFields.unit = unit;
  if (userCode) userFields.userCode = userCode;

  // from open weather
  if (location) userFields.location = getLocation;
  userFields.description = getMainDesc;
  userFields.icon = getIcon;
  userFields.mainWeather = getMain;
  userFields.temperature = getTemp;
  userFields.timezone = getTimeZone;
  userFields.wind = getWind;

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

router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await Location.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "Location not found" });

    await Location.findByIdAndRemove(req.params.id);

    res.json({ msg: "Location deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
