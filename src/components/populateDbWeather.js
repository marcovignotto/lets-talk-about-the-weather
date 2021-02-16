const axios = require("axios");
const config = require("config");
var CronJob = require("cron").CronJob;

const dbCleaning = require("../../config/dbDelete");

// URLs
const URL_GET_WEATHER_USERS = config.get("localApi.urlGetWeatherUsers");
const URL_POST_LOCATION = config.get("localApi.urlPostLocation");
const OPEN_WEATHER_URL = config.get("openWeartherAPI.apiUrl");
const OPEN_WEATHER_KEY = config.get("openWeartherAPI.apiKey");

// get al the users from mongo
const allWeatherUsers = async () => {
  try {
    const options = {
      method: "get",
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: config.get("authLocalApi.Bearer"),
      },
      url: URL_GET_WEATHER_USERS,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(options);
    return JSON.parse(res.data);
  } catch (err) {
    console.error(err);
  }
};

// POSTs on Mongo user location
const locationOnMongo = async (firstName, location, units, language) => {
  // Open Weather API CALL
  const URL = `${OPEN_WEATHER_URL}${location}&units=${units}&appid=${OPEN_WEATHER_KEY}&lang=${language}`;
  try {
    const options = {
      method: "get",
      url: URL,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(options);

    // // PARSE results
    const parsedRes = JSON.parse(res.data);

    const {
      getLocation = parsedRes.name,
      getMain = parsedRes.weather[0].main,
      getIcon = parsedRes.weather[0].icon,
      getMainDesc = parsedRes.weather[0].description,
      getTemp = parsedRes.main.temp,
      getWind = parsedRes.wind.speed,
    } = parsedRes;

    // // CREATEOBJ
    const objLocation = {
      firstName: firstName,
      language: language,
      description: getMainDesc,
      icon: getIcon,
      location: getLocation,
      mainWeather: getMain,
      temperature: getTemp,
      wind: getWind,
    };

    // send to mongo db
    try {
      const options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: config.get("authLocalApi.Bearer"),
        },
        data: objLocation,
        url: URL_POST_LOCATION,
        transformResponse: [
          (data) => {
            // transform the response
            return data;
          },
        ],
      };

      const resMongo = await axios(options);
      return JSON.parse(resMongo.data);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

// populate

const populateDbWeather = () => {
  dbCleaning().then((res) => {
    if (res.result.ok >= 1) {
      allWeatherUsers().then((res) => {
        console.log("DB Populated");
        res.map((x) =>
          locationOnMongo(x.firstName, x.location, x.language, x.unit)
        );
      });
    }
  });
};

var job = new CronJob(
  "0 */30 * * * *",
  function () {
    populateDbWeather();
  },
  null,
  true,
  "Europe/Berlin"
);
job.start();

module.exports = populateDbWeather;
