/**
 * @description calls Open Weather API
 * @requires axios
 */

const axios = require("axios");
const config = require("config");
var CronJob = require("cron").CronJob;

const dbCleaning = require("./dbDelete");

// URLs
const URL_GET_WEATHER_USERS = config.get("localApi.urlGetWeatherUsers");
const URL_POST_LOCATION = config.get("localApi.urlPostLocation");

//KEYS
const API_BEARER = process.env.API_BEARER;

/**
 * @description get all the users from mongo
 * @returns saved data on Mongo
 */

const allWeatherUsers = async () => {
  /**
   * @descripton 1° call to get all the users from mongo
   */

  try {
    const options = {
      method: "get",
      headers: {
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

/**
 *
 * @description POSTs on Mongo user location
 * @param {*} firstName
 * @param {*} location
 * @param {*} unit
 * @param {*} language
 * @param {*} userCode
 * @param {*} mainLocation
 * @returns saved data on Mongo
 */

const locationOnMongo = async (
  firstName,
  location,
  unit,
  language,
  userCode,
  mainLocation
) => {
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

    /**
     * @description send data to mongo
     * made by the route /api/locations = URL_POST_LOCATION
     */
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

/**
 * @description @dbCleaning > @allWeatherUsers get users from MongoDB
 * > sends every single item to @locationOnMongo
 * @used every 30 minutes by CronJob
 */

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
