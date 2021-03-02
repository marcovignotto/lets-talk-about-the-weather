const axios = require("axios");
const config = require("config");
var CronJob = require("cron").CronJob;

const dbCleaning = require("./dbDelete");

// URLs
const URL_GET_WEATHER_USERS = config.get("localApi.urlGetWeatherUsers");
const URL_POST_LOCATION = config.get("localApi.urlPostLocation");
const OPEN_WEATHER_URL = config.get("openWeartherAPI.apiUrl");
const OPEN_WEATHER_KEY = process.env.OW_API_KEY;

//KEYS
const API_BEARER = process.env.API_BEARER;

// get al the users from mongo
const allWeatherUsers = async () => {
  try {
    const options = {
      method: "get",
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: API_BEARER,
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
const locationOnMongo = async (
  firstName,
  location,
  unit,
  language,
  userCode,
  mainLocation
) => {
  // Open Weather API CALL
  // made by the route
  try {
    // CREATEOBJ
    const objLocation = {
      firstName,
      language,
      location,
      unit: unit,
      userCode,
      mainLocation,
    };

    // send to mongo db
    try {
      const options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: API_BEARER,
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
          locationOnMongo(
            x.firstName,
            x.location,
            x.unit,
            x.language,
            x.userCode,
            x.mainLocation,
            x.timezone
          )
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
