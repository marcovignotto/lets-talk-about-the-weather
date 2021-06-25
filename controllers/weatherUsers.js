/**
 * @description CTRL for the weather users
 * linkend with a location, displayed in the backend
 */

const { validationResult } = require("express-validator");

const WeatherUser = require("../models/WeatherUser");

exports.get = async (req, res, next) => {
  try {
    const weatherUsers = await WeatherUser.find({
      weatherUsers: req.weatherUsers,
    }).sort({
      date: -1,
    });

    return res.json({ success: true, data: weatherUsers });
  } catch (error) {
    console.log(error.message);
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    const { firstName, language, location, unit, mainLocation } = req.body;

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

    return res.json({ success: true, data: addUser });
  } catch (error) {
    console.error(error.message);
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};

exports.put = async (req, res, next) => {
  const { firstName, language, location, unit, userCode, mainLocation } =
    req.body;

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

    if (!user) {
      return next({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    user = await WeatherUser.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error(error.message);
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};

exports.del = async (req, res, next) => {
  try {
    let user = await WeatherUser.findById(req.params.id);

    if (!user) {
      return next({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    await WeatherUser.findByIdAndRemove(req.params.id);

    return res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error(error.message);
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};
