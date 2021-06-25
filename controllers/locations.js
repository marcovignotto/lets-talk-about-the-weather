/**
 * @desc CTRL for locations route
 * displayed in the frontend
 */

const openWeatherCall = require("../src/components/openWeatherCall");

const Location = require("../models/Location");

exports.get = async (req, res, next) => {
  try {
    const locations = await Location.find({ locations: req.locations }).sort({
      date: -1,
    });
    return res.json({ success: true, data: locations });
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
    const { firstName, language, location, unit, userCode, mainLocation } =
      req.body;

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

    return res.json({ success: true, data: toDo });
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
  const { firstName, language, unit, location, userCode, mainLocation } =
    req.body;

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

    if (!user) {
      return next({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    user = await Location.findByIdAndUpdate(
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
    let user = await Location.findById(req.params.id);

    if (!user)
      return next({
        success: false,
        message: "Location not found",
        status: 404,
      });

    await Location.findByIdAndRemove(req.params.id);

    return res.json({ success: true, message: "Location deleted" });
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
